import React from 'react'
import { Card } from 'antd'; 


type FeedbackProps = {
    title : string; 
    date : string; 
    description : string; 
    imageLink : string; 
    authorImg : string; 
}

export default function FeedbackCard({title, date, description, imageLink, authorImg} : FeedbackProps) {
  return (
    <>
    <Card style = {{marginTop: "3em", maxWidth:'50em', backgroundColor : '#EBEBEB'}}>
                    <p style = {{color : '#CC0000'}}>
                        <strong>{title}
                            </strong></p>
                    <div style = {{display:'flex', flexDirection : 'row'}}>
                    <p>
                        {description} </p>
                    <img style = {{maxWidth : '10em'}} src ={imageLink}></img>
                    </div>
                </Card>
    </>
  )
}

