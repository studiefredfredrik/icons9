<template>
  <div id="app" class="container">
    <div class=""></div>
    <div class="heading">Icons9</div>

    <div class="search-container">
      <input class="search-input" type="text" v-model="searchString" placeholder="Search for an icon..."/>
    </div>
      <!--<div class="options-container">-->
        <!--<div class="size-option">50x50</div>-->
        <!--<div class="color-option"></div>-->
      <!--</div>-->
    <div v-if="icons && icons.length > 0" class="file-container">
      <div v-for="(file, index) in icons" class="list-item" :key="index">
<!--        <img class="svg" v-bind:src="file.path" v-bind:alt="file.path" @click="copyToClipboard(file)">-->
        <img class="svg" v-bind:src="getImagePath(file)" v-bind:alt="file.path" @click="copyToClipboard(file)">
        <div class="full-name">{{file.fullName}}</div>
      </div>
    </div>
    <input type="text" v-model="searchString" id="copy-box"/>
    <div class="footer">
      <div class="footer-text"><a href="http://github.com/studiefredfredrik/icons9"><b>Icons9</b></a> - v0.2 - It works unless you're unlucky</div>
      <div class="footer-text">Icons by <a href="http://www.fontawesome.com">FontAwesome</a> (free set)</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'Main',
  data: function() {
    return{
      allicons: null,
      searchString: ''
    }
  },
  computed:{
    icons(){
      if(!this.allicons) return null
      let icons =  this.allicons.filter(icon => {
        if(icon.path.includes(this.searchString)) return true
        return false
      })
      console.log(icons)
      return icons.slice(0,100)
    }
  },
  mounted(){
    axios.get('./api/library')
      .then(response => {
        console.log(response.data)
        this.allicons = response.data
      })
  },
  methods:{
    copyToClipboard(file){
      let copyText = document.getElementById("copy-box");
      copyText.value = file.image.replace('<svg', '<svg width="50px" height="50px"')
      copyText.select();
      document.execCommand("copy");
    },
    getImagePath(file){
      let color = '#ff0011'
      let imgext = encodeURIComponent(file.image.replace('<path ', `<path style="fill:${color};stroke:${color};" `))
      console.log(imgext)

      //imgext = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path style="fill:green;stroke:green;" d="M205.9 512l31.1-38.4c12.3-.2 25.6-1.4 36.5-6.6 38.9-18.6 38.4-61.9 38.3-63.8-.1-5-.8-4.4-28.9-37.4H362c-.2 50.1-7.3 68.5-10.2 75.7-9.4 23.7-43.9 62.8-95.2 69.4-8.7 1.1-32.8 1.2-50.7 1.1zm200.4-167.7c38.6 0 58.5-13.6 73.7-30.9l-175.5-.3-17.4 31.3 119.2-.1zm-43.6-223.9v168.3h-73.5l-32.7 55.5H250c-52.3 0-58.1-56.5-58.3-58.9-1.2-13.2-21.3-11.6-20.1 1.8 1.4 15.8 8.8 40 26.4 57.1h-91c-25.5 0-110.8-26.8-107-114V16.9C0 .9 9.7.3 15 .1h82c.2 0 .3.1.5.1 4.3-.4 50.1-2.1 50.1 43.7 0 13.3 20.2 13.4 20.2 0 0-18.2-5.5-32.8-15.8-43.7h84.2c108.7-.4 126.5 79.4 126.5 120.2zm-132.5 56l64 29.3c13.3-45.5-42.2-71.7-64-29.3z"/></svg>`)
      let res = `data:image/svg+xml;utf8,${imgext}`

      // res = btoa(res)
      return res
    }
  }
}
</script>

<style scoped lang="scss">
  .heading{
    text-align: center;
    margin: 30px 0 30px 0;
    font-size: 36px;
  }
  .search-container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 30px;
    outline: none;
  }
  .search-input{
    border-radius: 50px;
    padding: 4px 10px 4px 10px;
    border: solid 2px #000000;
  }
  .search-input::placeholder{
    color: #626262;
  }
  .options-container{
    align-self: flex-end;
  }
  .footer{
    position: relative;
    bottom: 20px;
    margin-top: 30px
  }
  .footer-text{
    text-align: center;
    font-style: italic;
    color: #626262;
    font-size: 12px;
  }
  .svg{
    margin: auto;
    height: 30px;
    width: auto;
    cursor: pointer;

  }
  .svg:active{
    color:red;
  }
  .container{
    width: 80%;
    margin: auto;
  }
  .input{
    margin: 20px;
  }
  .file-container{
    display: grid;
    grid-template-columns: auto auto auto auto;
    justify-items: center;
  }
  .full-name{

  }
  .list-item{
    width: 150px;
    margin: 10px 1px;
    justify-items: center;
  }
  #copy-box{
    height: 1px;
    width: 1px;
    border: none;
    outline: none;
    color: #FFF;
    background-color: #FFF;
  }
  textarea:focus, input:focus{
    outline: none;
  }
  a{
    outline: none;
    text-decoration: none;
    color: #626262;
  }

  @media only screen and (max-width: 750px) {
    .container{
      width: 100%;
      margin: auto;
    }
    .file-container{
      display: grid;
      grid-template-columns: auto auto auto;
    }
  }
  @media only screen and (min-width: 1930px) {
    .file-container{
      display: grid;
      grid-template-columns: auto auto auto auto auto auto;
    }
  }
</style>
