import React from 'react'
import { StyleSheet, Text, Dimensions, View,} from 'react-native'
import SvgUri from 'react-native-svg-uri';
import testSvg_ from '../../assets/icons/Home.svg'
const xml = `

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
  <g>
    <rect width="24" height="24" x="0" y="0" fill="none" rx="0" ry="0"/>
    <g transform="translate(4 2)">
      <use fill="rgb(151,151,151)" xlink:href="#path-2"/>
      <g mask="url(#mask-3)">
        <g transform="translate(-4 -2)">
          <rect width="24" height="24" x="0" y="0" fill="rgb(95,92,127)"/>
          <rect width="24" height="24" x="0" y="0" fill="rgb(95,92,127)" rx="0" ry="0"/>
        </g>
      </g>
    </g>
  </g>
</svg>


`;

const TestSvgUri = (url) => (
 
    <SvgUri
      width="30"
      height="30"
      svgXmlData={xml}
      
    />
);



export default TestSvgUri