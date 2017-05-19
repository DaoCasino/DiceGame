package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/antonholmquist/jason"
	"github.com/gorilla/websocket"
)

var idGame = make(chan string)
var lastBlock = "0xE5FB4"
var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan Message)
var stop = make(chan bool)
var url = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl"
var lastTx []Message

type logsParams struct {
	fromBlock string
	toBlock   string
	address   string
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Tx   string `json:"transaction"`
	Data string `json:"data"`
}

type request struct {
	id      int
	jsonrpc string
	method  string
	params  logsParams
}

func getInfo(address string, stop chan bool) {

	client := http.Client{}
	for {

		select {
		case <-stop:
			fmt.Println("________STOP_____________")
			return
		default:
			time.Sleep(1000 * time.Millisecond)
			var jsonprep string = "{\"id\":74,\"jsonrpc\":\"2.0\",\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"" + lastBlock + "\",\"toBlock\":\"latest\",\"address\":\"" + address + "\"}]}"
			var jsonStr = []byte(jsonprep)
			req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
			req.Header.Set("Content-Type", "application/json")
			resp, err := client.Do(req)
			if err != nil {
				fmt.Println("Unable to reach the server.")
			} else {
				v, _ := jason.NewObjectFromReader(resp.Body)
				o, _ := v.GetObjectArray("result")

				if len(o) == 0 {
					// fmt.Println("NULL")
				} else {
					lastBlock, _ = o[len(o)-1].GetString("blockNumber")
					d, _ := strconv.ParseInt(lastBlock, 0, 64)
					lastBlock = "0x" + strconv.FormatInt(d+1, 16)

					for _, friend := range o {
						data, _ := friend.GetString("data")
						tx, _ := friend.GetString("transactionHash")
						gameID := data[2:len(data)]
						info := getInfoByID(address, gameID)
						mes := Message{tx, info}
						lastTx = append(lastTx, mes)
						broadcast <- mes
						fmt.Println("MESSAGE:", tx)
					}
				}

			}

		}
	}

}

func getInfoByID(address string, id string) string {
	for {
		client := http.Client{}
		var jsonprep string = "{\"id\":0,\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"" + address + "\",\"data\":\"0xa7222dcd" + id + "\"},\"latest\"]}"
		var jsonStr = []byte(jsonprep)
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Unable to reach the server.")
		} else {
			v, _ := jason.NewObjectFromReader(resp.Body)
			o, _ := v.GetString("result")
			return o
		}
	}

}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register our new client
	clients[ws] = true
	sendLastGame(ws)
	for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
		//fmt.Println("msg", msg)

	}
}

func sendLastGame(w *websocket.Conn) {
	fmt.Println("________LAST___MESSAGE____________:", len(lastTx))
	if len(lastTx) == 0 {
		// fmt.Println("NULL")
	} else {
		fmt.Println("________!!____________:", len(lastTx))
		for i := (len(lastTx) - 10); i < len(lastTx); i++ {
			fmt.Println("mes:", lastTx[i], i)
			err := w.WriteJSON(lastTx[i])
			if err != nil {
				log.Printf("error: %v", err)
			}
		}
	}
}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		//fmt.Println("CAST", <-broadcast, msg)
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}

	}
}

func getBankrollers() {
	for {
		arr := []string{}
		resp, _ := http.Get("https://platform.dao.casino/api/proxy.php?a=bankrolls")
		b, _ := ioutil.ReadAll(resp.Body)
		_ = json.Unmarshal(b, &arr)
		if len(arr) != 0 {
			for i, element := range arr {
				go getInfo(element, stop)
				fmt.Println("address:", element, i)
			}
		} else {
			fmt.Println("_________DEFAULT CONTRACT__________________")
			go getInfo("0x6a8F29E3D9E25bc683A852765F24eCb4Be5903FC", stop)
		}
		time.Sleep(100 * time.Second)
		//lastTx = []Message{}
		stop <- true
	}
}

func main() {
	go handleMessages()
	go getBankrollers()
	http.HandleFunc("/ws", handleConnections)

	log.Println("http server started on :8081")
	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
