<template>
<body />
</template>
<style lang="scss">
html, body {
	width: 100%;
	height: 100%;
    margin: 0;
    padding: 0;
}

body {
    background: linear-gradient(126deg, #434c83, #13254f, #0b6a4d, #6fa00d);
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