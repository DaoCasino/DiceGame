package main

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/antonholmquist/jason"
	"github.com/gorilla/websocket"
)

var idGame = make(chan string)
var lastBlock = "0xD9490"
var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan Message)
var idChanel = make(chan string)

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
	Data string `json:"data"`
}

type request struct {
	id      int
	jsonrpc string
	method  string
	params  logsParams
}

func makeHTTPPostReq(url string) {
	//var dat map[string]interface{}
	client := http.Client{}

	for {
		time.Sleep(1000 * time.Millisecond)
		var jsonprep string = "{\"id\":74,\"jsonrpc\":\"2.0\",\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"" + lastBlock + "\",\"toBlock\":\"latest\",\"address\":\"0x04010e34df5139ac91ce4147ef6e50dbb060c66d\"}]}"
		var jsonStr = []byte(jsonprep)
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Unable to reach the server.")
		} else {
			fmt.Println("RESP:", resp.Body)
			//body, _ := ioutil.ReadAll(resp.Body)
			v, _ := jason.NewObjectFromReader(resp.Body)
			o, _ := v.GetObjectArray("result")
			if len(o) != 0 {
				lastBlock, _ = o[len(o)-1].GetString("blockNumber")
				d, _ := strconv.ParseInt(lastBlock, 0, 64)
				lastBlock = "0x" + strconv.FormatInt(d+1, 16)

				for _, friend := range o {
					//name, _ := friend.GetString("address")
					data, _ := friend.GetString("data")
					tx, _ := friend.GetString("transactionHash")
					// block, _ := friend.GetString("blockNumber")
					// lastBlock = block
					//fmt.Println("Tx:", tx)
					gameId := data[2:len(data)]
					//fmt.Println("DATA:", gameId)
					idChanel <- tx + gameId
					//go getInfoById("https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl", substring)

				}

				//fmt.Println("body:", string(body))
				//er := json.Unmarshal(body, &dat)
				//fmt.Println("no", dat["result"][1])
				//fmt.Printf("re", er)
			}
		}

	}

}

func getInfoByID(url string, idCh chan string) {

	for {
		info := <-idCh
		tx := info[0:66]
		id := info[66:len(info)]
		//fmt.Println("CHANEL:", id, tx)
		//var dat map[string]interface{}
		client := http.Client{}

		var jsonprep string = "{\"id\":0,\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"0x04010e34df5139ac91ce4147ef6e50dbb060c66d\",\"data\":\"0xa7222dcd" + id + "\"},\"latest\"]}"
		//fmt.Println("string:", jsonprep)
		var jsonStr = []byte(jsonprep)

		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
		req.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Unable to reach the server.")
		} else {
			//body, _ := ioutil.ReadAll(resp.Body)
			v, _ := jason.NewObjectFromReader(resp.Body)
			o, _ := v.GetString("result")
			ms := Message{o + tx}
			lastTx = append(lastTx, ms)
			//fmt.Println("array:", lastTx)
			//c := Message{"true"}
			//fmt.Println("RESULT:", o)
			broadcast <- ms
			//broadcast <- c

			//fmt.Println("body:", string(body))
			//er := json.Unmarshal(body, &dat)
			//fmt.Println("no", dat["result"][1])
			//fmt.Printf("re", er)
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
		fmt.Println("msg", msg)

	}
}

func sendLastGame(w *websocket.Conn) {
	for mes := range lastTx {
		fmt.Println("mes:", lastTx[mes])
		err := w.WriteJSON(lastTx[mes])
		if err != nil {
			log.Printf("error: %v", err)
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

func main() {
	go makeHTTPPostReq("https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl")
	go getInfoByID("https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl", idChanel)
	// Configure websocket route
	http.HandleFunc("/ws", handleConnections)

	// Start listening for incoming chat messages
	go handleMessages()
	//go ropstenStatus()
	// Start the server on localhost port 8000 and log any errors
	log.Println("http server started on :8081")
	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	//getInfoById("https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl", idGame)

}

// func ropstenStatus() {
// 	var status string
// 	go func() {
// 		for {
// 			doc, err := goquery.NewDocument("http://status.infura.io/2252199")

// 			if err != nil {
// 				log.Fatal(err)
// 			}
// 			doc.Find("#statusIcon").Each(func(index int, item *goquery.Selection) {
// 				title, _ := item.Attr("class")
// 				if title == "up" {
// 					status = "true"
// 				} else {
// 					status = "false"
// 				}
// 			})
// 			c := Message{status, "11"}
// 			broadcast <- c
// 		}
// 	}()
// }
