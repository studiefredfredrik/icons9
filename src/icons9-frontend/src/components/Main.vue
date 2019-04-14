<template>
  <div id="app" class="container">
    <div class="heading">Icons9</div>

    <div class="search-container">
      <input class="search-input" type="text" v-model="searchString" placeholder="Search for an icon..."/>
    </div>
      <!--<div class="options-container">-->
        <!--<div class="size-option">50x50</div>-->
        <!--<div class="color-option"></div>-->
      <!--</div>-->
    <div v-if="icons && icons.length > 0" class="file-container">
      <div v-for="(file, index) in icons" class="list-item">
        <img class="svg" v-bind:src="file.path" v-bind:alt="file.path" @click="copyToClipboard(file)">
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
    height: 30px;
    width: auto;
    color: black;
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
  }
  .list-item{
    margin: 10px;
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

  @media only screen and (max-width: 600px) {
    .container{
      width: 100%;
      margin: auto;
    }
    .file-container{
      display: grid;
      grid-template-columns: auto auto auto;
    }
  }
</style>
