import React from 'react'

export const App = () => {
  console.log('App component is rendering')
  
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px',
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>DEBUG: App is working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      
      <div style={{
        backgroundColor: 'blue',
        border: '2px solid yellow',
        padding: '20px',
        margin: '20px 0'
      }}>
        <p>This should be a blue box with yellow border</p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxWidth: '400px',
        backgroundColor: 'green',
        padding: '20px'
      }}>
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'orange',
              border: '2px solid black',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}