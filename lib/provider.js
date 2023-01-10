import React, { useState } from "react"

export const myContext = React.createContext()

const Provider = props => {
  const [visitedNodes, setVisitedNodes] = useState([])
  return (
    <myContext.Provider
      value={{
        visitedNodes,
        setVisitedNodes: value => setVisitedNodes(value),
      }}
    >
      {props.children}
    </myContext.Provider>
  )
}

export default ({ element }) => (
 
  <>
    <Provider>{element}</Provider>
  </>
)