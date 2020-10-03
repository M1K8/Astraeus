<template>
  <div id="container">
    <top-row>

      <home-logo-container> 
        <router-link to="/"><img src="@/assets/m1k.png" /></router-link> 
      </home-logo-container>

      <padding/>

      <settings-container>
        <router-link to="/"><img src="@/assets/m1k.png" /></router-link> 
      </settings-container>

      <logout-container/>

    </top-row>

    <hr/>

    <div id="main">
        <router-view />
    </div>
  </div>
</template>

<style lang="scss">
 * {
       margin: 0
       ;
       background-color: #2c3e50 ;
   }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color: #2c3e50;
} 

hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(100, 100, 100, 0.3), rgba(255, 255, 255, 0.85), rgba(100, 100, 100, 0.3));
}

#container {
  display: flex;
  flex-direction: column;
}

#container > top-row {
  display: flex;
  background-color: 2c3e50;
  flex: 90%;
}

top-row > home-logo-container {
  flex : 2%;
  background-color: 2c3e50;
  
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 15px;
}

top-row > settings-container {
  flex : 0 0 50px;
  justify-content: flex-end;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 5px;

}

top-row > logout-container {
  flex : 0 0 50px;
  background-color: yellow;
  margin-top: 5px;
  margin-right: 15px;

}

top-row > padding {
  flex: 98%;
  background-color: green;
}

#main {
  flex: 10%;
  margin-top: 2px;
}
</style>
