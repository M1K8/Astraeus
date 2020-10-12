<template>
    <body>
        <router-view />
    </body>
</template>


<style scoped lang="scss">
html, body {
	width: 100vw;
	height: 100vh;
    margin: 0;
    padding: 0;
}


body{
    background: linear-gradient(126deg, #4d5bb6, #1a336f, #0f8360, #7aae14);
    background-size: 600% 600%;

    -webkit-animation: Gradient 30s ease infinite;
    -moz-animation: Gradient 30s ease infinite;
    animation: Gradient 30s ease infinite;
}

@-webkit-keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@-moz-keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
</style>