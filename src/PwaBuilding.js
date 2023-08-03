import { LitElement, html, css } from 'lit';

import '@material/mwc-tab-bar/mwc-tab-bar.js';
import '@material/mwc-tab/mwc-tab.js';
import { pwaStyle } from './style.js';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;
const bot = new URL('../assets/bot.svg', import.meta.url).href;
const user = new URL('../assets/user.svg', import.meta.url).href;

//import { bot } from '../assets/bot.svg';
//import { user } from '../assets/user.svg';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgJuvHnSU5YYbhAoKkVpRryxKop02whrw",
  authDomain: "pwabuilding.firebaseapp.com",
  projectId: "pwabuilding",
  storageBucket: "pwabuilding.appspot.com",
  messagingSenderId: "715748179723",
  appId: "1:715748179723:web:dac9483ea2a78799b2ec0e",
  measurementId: "G-0B9VEEJYVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);








//const form = document.querySelector('form');
//const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += '.';

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === '....') {
          element.textContent = '';
      }
  }, 300);
}

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
      if (index < text.length) {
          element.innerHTML += text.charAt(index)
          index++
      } else {
          clearInterval(interval)
      }
  }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
      `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `
  )
}

export class PwaBuilding extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      form: { type: Object },
      chatContainer: { type: Object },
      conversation: { type: Array },
    };
  }
    
  static get styles() {
    return [
      pwaStyle,
      css`

      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        
        background-color: var(--rapi-ai-background-color);
      }

      main {
        flex-grow: 1;
      }

      .logo {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      mwc-tab-bar {
        --mdc-theme-primary: white;
        --mdc-text-transform: none;
        --mdc-tab-color-default: blue;
        --mdc-tab-text-label-color-default: blue;
        --mdc-tab-stacked-height: 100px;
      }


      .oculto {
        display: none;
      }

      .nooculto {
        display: flex;
      }

    `];
  }

  constructor() {
    super();
    this.title = 'PWA Building';
    this.conversation = [
      {role: 'system', content: 'you are friendly assistant that speaks like a mexican'}
    ];
  }

  firstUpdated() {
    this.form = this.shadowRoot.getElementById('form');
    this.chatContainer = this.shadowRoot.getElementById('chat_container');
    this.form.addEventListener('submit', (e) => {this.handleSubmit(e)});
    this.form.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        this.handleSubmit(e)
      }
    });
  }

  _changePage(){
    this.requestUpdate();
  }

  render() {
    let activeIndex = this.shadowRoot.getElementById('myTabs')?this.shadowRoot.getElementById('myTabs').activeIndex:1;
    return html`
      <main>
        <div id="app">
          <mwc-tab-bar id="myTabs" activeIndex="1" @MDCTabBar:activated="${this._changePage}">
            <mwc-tab label="Help"></mwc-tab>
            <mwc-tab label="Ask"></mwc-tab>
            <mwc-tab label="Chat"></mwc-tab>
            <mwc-tab label="Body"></mwc-tab>
          </mwc-tab-bar>
          <div id="chat_container" class=${activeIndex==0 ? 'oculto' : 'nooculto'}></div>
          <form id="form" class=${activeIndex==0 ? 'oculto' : 'nooculto'}>
            <textarea name="prompt" rows="1" cols="1" placeholder="${(activeIndex==1)?'Ask anything...':(activeIndex==2)?'Chat about anything...':'Ask about cells...'}"></textarea>
            <button type="submit"><img src="assets/send.svg" /></button>
          </form>
          <div class=${activeIndex==0 ? 'nooculto helpContainer' : 'oculto helpContainer'}>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
            <p>Help</p>
          </div>
        </div>

      </main>
    `;
  }

  async handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(this.form);

    let myLittleActiveIndex = this.shadowRoot.getElementById('myTabs').activeIndex;

    // user's chatstripe
    this.chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    if (this.myLittleActiveIndex==2)
        this.conversation.push({role: 'user', content: data.get('prompt')})

    // to clear the textarea input 
    this.form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    this.chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

    // specific message div 
    // const messageDiv = document.getElementById(uniqueId)
    const messageDiv = this.shadowRoot.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    // let myLittleActiveIndex = this.shadowRoot.getElementById('myTabs').activeIndex;
    let response;
    if(myLittleActiveIndex==2){
      console.log(
        "lets call the server with this conversation: ",
        this.conversation
      );
      //response = await fetch("http://localhost:5000", {
      response = await fetch("https://guandolo.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            this.conversation,
          taskId: myLittleActiveIndex,
        }),
      });
    } else {
      console.log(
        "lets call the server with this prompt: ",
        data.get("prompt")
      );
      //const response = await fetch("http://localhost:5000", {
      response = await fetch("https://guandolo.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            data.get("prompt"),
          taskId: myLittleActiveIndex,
        }),
      });
    }
    

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
      if (this.myLittleActiveIndex==2)
        this.conversation.push({role: 'assistant', content: parsedData})

      typeText(messageDiv, parsedData)

      console.log('this is the conversation',this.conversation);
    } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
      console.log(err)
    }

  }

}

