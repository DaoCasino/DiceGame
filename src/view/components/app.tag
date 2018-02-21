import route from 'riot-route'

<app>
  <script type="es6">
    /* global route */
    this.on('mount', () => {
      route((screen, action, other) => {
        if (!screen) { screen = 'game-page' }
        riot.mount(this.refs.mount_point, screen, {route:{screen:screen, action:action, other:other}})
      })
    })
  </script>

  <div class="wrapper">
	  <page-head></page-head>
		<div id="app">
			<div ref="mount_point"></div>
		</div>
  </div>

  <style type="less"></style>
</app>