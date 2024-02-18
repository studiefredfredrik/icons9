<template>
  <div>
    <div id="app" class="container">
      <div class="toolbox-left">
        <input type="radio" id="mdi" name="mdi" value="mdi" v-model="iconset" @change="getIcons">
        <label for="mdi">mdi</label><br>
        <input type="radio" id="fas" name="fas" value="fas" v-model="iconset" @change="getIcons">
        <label for="fas">fas</label>
      </div>
      <div class="toolbox-right">
        <input type="color" class="colorpicker" :value="color" @change="updateColor" @input="updateColor"/><br>
        <span class="color-text">{{color}}</span>
      </div>
      <div class="heading">Icons9</div>

      <div class="search-container">
        <input class="search-input" type="text" v-model="searchString" placeholder="Search for an icon..."/>
      </div>
      <div v-if="icons && icons.length > 0" class="file-container">
        <div v-for="(file, index) in icons" class="list-item" :key="index">
          <img class="svg" v-bind:src="getImagePath(file)" v-bind:alt="file.path" @click="copyToClipboard(file)">
          <div class="full-name">{{file.fullName}}</div>
        </div>
      </div>
      <div class="expand-all" @click="toggleLimit" v-if="icons && icons.length >= 100">
        <span v-if="limit === 100">Limited to 100, show everything?</span>
        <span v-if="limit !== 100">Showing everything, limit to 100?</span>
      </div>
      <input type="text" v-model="searchString" id="copy-box"/>
      <div class="footer">
        <div class="footer-text"><a href="http://github.com/studiefredfredrik/icons9"><b>Icons9</b></a> - v0.4 - Color selector added + mdi icons</div>
        <div class="footer-text">Icons by <a href="http://www.fontawesome.com">FontAwesome</a> (free set)</div>
        <div class="footer-text">Icons by <a href="https://codeload.github.com/google/material-design-icons/zip/master">Material design icons</a> (free set)</div>
      </div>
    </div>
    <div class="toaster fade-in" v-if="toasterShown">
      <div class="toaster-inner">
        {{toasterMessage}}
      </div>

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
      searchString: '',
      color: '#6F6F6F',
      colorDebounceHolder: null,
      iconset: 'mdi',
      limit: 100,
      toasterMessage: '',
      toasterShown: false,
      toasterDebounceHolder: null
    }
  },
  computed:{
    icons(){
      if(!this.allicons) return null
      let icons =  this.allicons.filter(icon => {
        if(icon.path.includes(this.searchString)) return true
        return false
      })
      return icons.slice(0, this.limit)
    }
  },
  mounted(){
    this.getIcons()
  },
  methods:{
    getIcons(){
      axios.get(`./api/library-${this.iconset}`)
        .then(response => {
          this.allicons = response.data
        })
    },
    copyToClipboard(file){
      let copyText = document.getElementById("copy-box");
      copyText.value = file.image
        .replace('<path ', `<path style="fill:${this.color};" `) // Add color
        .replace('width="48" height="48" ','') // Remove sixe from mdi icons
        .replace('<svg', '<svg width="50px" height="50px"') // Add size to icons
      copyText.select();
      document.execCommand("copy");
      this.showToaster('Icon SVG copied to clipboard')
    },
    getImagePath(file){
      let image = encodeURIComponent(file.image.replace('<path ', `<path style="fill:${this.color};" `))
      return `data:image/svg+xml;utf8,${image}`
    },
    updateColor(e){
      clearTimeout(this.colorDebounceHolder)

      this.colorDebounceHolder = setTimeout(() => {
        this.color = e.target.value
      }, 100)
    },
    toggleLimit(){
      if(this.limit === 100) this.limit = 10000
      else this.limit = 100
    },
    showToaster(message){
      this.toasterMessage = message
      clearTimeout(this.toasterDebounceHolder)
      this.toasterShown = true
      this.toasterDebounceHolder = setTimeout(() => {
        this.toasterShown = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
  .toolbox-left{
    position: absolute;
    top: 0;
    left: 0;
    margin: 8px;

    label{
      margin-left: 5px
    }
  }
  .toolbox-right{
    position: absolute;
    top: 0;
    right: 0;
    margin: 8px;

    .color-text{
      font-weight: bold;
      font-size: 12px;
    }
  }
  input[type=color]{
    width: 25px;
    height: 25px;
    border: none;
    border-radius: 25px;
    background: none;
    float: right;
    margin-bottom: 5px
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: solid 1px #000; /*change color of the swatch border here*/
    border-radius: 40px;
  }

  input[type='radio']:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #d1d3d1;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
  }

  input[type='radio']:checked:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #6F6F6F;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
  }

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

  .expand-all{
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 20px;
    cursor: pointer;
    font-size: 16px;
    color: #000000;
    font-style: italic;
    text-align: left;
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

  .toaster{
    position: fixed;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    /*opacity: 0.5;*/
  }
  .toaster-inner{
    background-color:#6F6F6F;
    color: #FFFFFF;
    padding: 20px 80px 20px 80px;
    border-radius: 10px;
    margin: auto;
    width: 200px;
    height: 40px;
    opacity: 0.7;
  }

  .fade-in {
    animation: fadeInOpacity 0.15s linear;
  }

  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.7;
    }
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
