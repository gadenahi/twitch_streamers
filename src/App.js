import React from 'react';
import './App.css';
import fetchJsonp from 'fetch-jsonp'; 


  const url = 'https://wind-bow.glitch.me/twitch-api/streams/'
  const streamers = [ "freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas" ];
  
  // Show the Response of API
  const TBody = props => (props.status ==='ONLINE') ? (
    <tr key={props.streamer} className='online'>
      <td> <img src={props.preview} alt='logo'></img></td>
      <td> 
        <a href={props.url} target='_blank' rel="noopener noreferrer">{props.streamer}</a>     
      </td>
      <td> {props.status} </td>
    </tr>
  ) : (
    <tr key={props.streamer} className='offline'>
      <td> <img src={ props.preview} alt='logo'></img></td>
      <td> 
        <p>{props.streamer}</p>     
      </td>
      <td> {props.status} </td>
    </tr>
  );
  
  //Table Title
  const THead = props => (
    <thead>
      <tr>
        <th>Logo</th>
        <th>Streamer</th>
        <th>Status</th>
      </tr>
    </thead>
  )
  
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        radio : [
          {value:'All', name: 'All', checked:true},
          {value:'ONLINE', name: 'ONLINE', checked:false},
          {value:'OFFLINE', name: 'OFFLINE', checked:false}
        ],
        stream: [],
        radioStatus: 'All'
      };
      this.callAPI = this.callAPI.bind(this)
      this.handleRadioClick = this.handleRadioClick.bind(this)
      // Default view 
      streamers.forEach(this.callAPI)
    }
     
    //axios didnt support JSONP 
    // componentDidMount() {
    //    axios.get(url + 'freecodecamp' + '?callback=?')
    //     .then((res) => {
    //     console.log('data', res.data);
    //   })
    //   .catch(console.error);
    // }
      
      // The callback parameter gets added automatically by fetch-jsonp.
      callAPI(streamer) {  
        var radioStatus = this.state.radioStatus
        fetchJsonp(url + streamer)
        // fetchJsonp(url + streamer + `?callback=?`)          
          .then(function(response) {
          return response.json()
        }).then((json) => {
          const stream = this.state.stream;
          if(radioStatus === 'All') {
            if (json.stream === null) {
              stream.push({
                streamer: streamer, 
                status: 'OFFLINE',
                url: 'OFFLINE',
                preview: 'OFFLINE'})
              } 
            else {
              stream.push({
                streamer: streamer, 
                status: 'ONLINE', 
                url: json.stream.channel.url, 
                preview: json.stream.preview.small})        
            }} 
          else if (radioStatus === 'ONLINE') {
            if (json.stream !== null) {
              stream.push({
                streamer: streamer, 
                status: 'ONLINE', 
                url: json.stream.channel.url, 
                preview: json.stream.preview.small})          
              }
            } 
          else {
            stream.push({
              streamer: streamer, 
              status: 'OFFLINE',
              url: 'OFFLINE',
              preview: 'OFFLINE'})  
          }
          this.setState({
            stream
          }) 
        }).catch(function(ex) {
          console.log('parsing failed', ex)
        })
      };
    
    handleRadioClick = e => {
      const status = e.target.value; 
      const radio = this.state.radio;      
      // Need to operate the radio button by React
      const value = radio.map((item) => {
        return ({
          value: item.value,
          name: item.name,
          checked: (item.value === status)? true: false
        })
      });      
      this.setState({
        radio: value, stream: [],
        radioStatus: status
      }, () => {        
        //after setState, call API
            streamers.forEach(this.callAPI)
      })
    };
    
    //didnt use the filter function as API needs to be accessed whenever clicked
      
    // this.setState({stream: [], radioStatus: status})
    // streamers.forEach(this.callAPI)
    // const streams = this.filterStreams({
    //   status
    // });
    // this.setState({stream: streams})
    // };          
    // filterStreams = ({status}) => {
    //   return this.state.stream
    //     .filter(data => {
    //     console.log('filter status', status)
    //     if(status === 'All') {
    //       return data.status === 'ONLINE' || data.status ==='OFFLINE'
    //     } else {
    //       return data.status === status;       
    //     }
    //   })
    // }
                                   
    render() {    
      const stream = this.state.stream;
      const tbody = stream.map(TBody);
      const radio = this.state.radio;
      const listItems = radio.map((r) =>
      <label key={r.value.toString()} className={r.value}>
        <input 
          type="radio"
          name="select"
          value={r.value}
          checked={r.checked}
          onChange={this.handleRadioClick} />
          {r.name} <br />
      </label>          
      );                             
      return (
        <div>
          <div className='title'>
            <h1>TWITCH STREAMERS</h1>
            <form>{listItems}</form>                  
          </div>
          <div className='body'>                          
          <table>
            <THead />
            <tbody>
              { tbody }
            </tbody>
          </table> 
          </div>
        </div>
      )
    }
  }

export default App;
