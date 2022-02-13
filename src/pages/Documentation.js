import React from 'react';
import '../stylesheets/Documentation.css';
import App from '../App'

function Documentation() {
  var Gist = require('react-gist');
  
  return (
    <iframe id='gist' className='gist' src='https://notebooks.githubusercontent.com/view/ipynb?color_mode=auto&commit=2d373bd023309abc70587d8bad7e63f4b7d6467b&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f676973742f476f6e7a616c6f4d6564696e614d6564696e612f61666662333830326662396139313361393934643065626533373465626134322f7261772f326433373362643032333330396162633730353837643862616437653633663462376436343637622f636f70792d6f662d786c6d2d742d66696e652d74756e696e672d6f6e2d637573746f6d2d64617461736574732e6970796e62&nwo=GonzaloMedinaMedina%2Faffb3802fb9a913a994d0ebe374eba42&path=copy-of-xlm-t-fine-tuning-on-custom-datasets.ipynb&repository_id=113049115&repository_type=Gist#302c9d20-0084-4dad-b8dc-ffebf6575628'></iframe>
    );
}

export default Documentation;