<template>
    <text> {{this.slug}} </text>
</template>

<script lang="ts">
import Vue, { defineComponent, ref } from 'vue'
export default defineComponent({
    props: {
        slug : {
            type : String,
            required : true
        }
    }
    
})
</script>