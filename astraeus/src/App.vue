<template>
  <div id="container">
    <router-view />
  </div>
</template>

<style lang="scss">
 * {
       margin: 0;
       background-color: #2c3e50 ;
   }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
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
</style>
