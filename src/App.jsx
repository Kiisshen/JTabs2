import { useState, useRef, useEffect } from 'react';
import './App.css';
import { saveAs } from 'file-saver';

function App() {
  const [noteCount, setNoteCount] = useState(0)
  const [tabs, setTabs] = useState([{notes: -1, id: 0}]);
  const [tabID, setTabID] = useState(1)
  const tabRefs = useRef({});
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [fileName, setFileName] = useState("default_tab")
  const [viewMode, setViewMode] = useState(false)
  const [fillTabs, setFillTabs] = useState([])

  useEffect(() => {
      const storedTabs = localStorage.getItem('loadedTabs');
      if (storedTabs) {
          const parsedTabs = JSON.parse(storedTabs);
          setLoadedTabs(parsedTabs);
      }
  }, []);

  useEffect(() => {
    if (loadedTabs.length > 0) {
      loadTabs();
      setFillTabs(loadedTabs);
    }
  }, [loadedTabs]);

  useEffect(() => {
  }, [tabs]);

  useEffect(() => {
  }), [tabID]

  function loadTabs(){
    let newTabs = [];
    let newTabID = tabID;

    for(let i = 0; i < loadedTabs.length; i++){
      const newTab = {notes: loadedTabs[i].length, id: newTabID}
      newTabs.push(newTab)
      newTabID++;
    }

    setTabID(newTabID)
    setTabs(prevTabs => [...prevTabs, ...newTabs]);
    if(tabs[0].notes == -1){
      setTabs(prevTabs => prevTabs.slice(1));
    }

    console.log(tabs)
  }

  const addItem = (id) => {
    setTabs((prevTabs) => {
      const newTab = { notes: -1, id: tabID };
      setTabID(tabID + 1);

      const index = prevTabs.findIndex((tab) => tab.id === id);
  
      if (index !== -1) {
        const updatedTabs = [...prevTabs];
        updatedTabs.splice(index + 1, 0, newTab);
        return updatedTabs;
      }
  
      return [...prevTabs, newTab];
    });
  };

  const modifyItem = (e, id) => {
    e.preventDefault();
    setTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id === id) {
          const modifiedTab = { ...tab, notes: noteCount };
          return modifiedTab;
        }
        return tab;
      });
    });
  }

  const deleteTab = (id, index) => {
    setTabs((prevTabs) => {
      return prevTabs.filter((tab) => tab.id !== id);
    });
    if(fillTabs.length > 0)
      fillTabs[index] = [];
  };

  const saveNotes = () => {
    const tabJSON = []
    tabs.forEach(tab => {
      const tabRef = tabRefs.current[tab.id];
      const currentTab = []
      for (let i = 0; i < tabRef.children.length; i++) {
        const child = tabRef.children[i];
        const currentFret = []
        if (child.classList.contains('fret')) {
          for (let j = 0; j < child.children.length; j++) {
            const inputField = child.children[j];
            if(inputField.value == "" && inputField.placeholder != null){
              currentFret.push(inputField.placeholder)
            }
            else {
              currentFret.push(inputField.value)
            }
          }
          currentTab.push(currentFret)
        }
      }
      tabJSON.push(currentTab)
    });
    const jsonString = JSON.stringify(tabJSON, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    localStorage.setItem('loadedTabs', jsonString);
    saveAs(blob, fileName);
  };

  function handleChange(e, index, i, j){
    if(fillTabs.length > 0){
      fillTabs[index][i][j] = e.target.value;
      e.target.placeholder = e.target.value;
    }
    if(e.target.value != ""){
      e.target.id = "hasInput"
    }
    else {
      e.target.id = ""
    }
  }

  function handleKeyDown(e){
    if(fillTabs.length > 0){
      if(e.target.placeholder != null){
        e.target.value = e.target.placeholder
      }
    }
  }

  function handlePlaceHolders(index, i, j){
    return
  }

  return (
    <>
      <div className='app'>
      {tabs.length <= 0 ? (
          <>
            {setTabs((prevTabs) => [
            ...prevTabs,
            { notes: -1, id: tabID }
            ])}
            {setTabID(tabID + 1)}
          </>
        ) : (
          <>
            {tabs.map((tab, index) => {
              return (
                (tab.notes === -1) ? (
                  <div className='nextTab'>
                    <form>
                    <p>Pick amount of notes in next Tab</p>
                      <input placeholder={noteCount} onBlur={(e) => {
                        e.target.value < 0 ? setNoteCount(0) : (e.target.value > 12 ? setNoteCount(12) : setNoteCount(e.target.value)), tab.id
                      }}></input>
                      <button onClick={(e) => modifyItem(e, tab.id)}>Add Tab</button>
                    </form>
                  </div>
                ) : (
                  <div key={tab.id} className='tab' ref={(ref) => (tabRefs.current[tab.id] = ref)}>
                    {!viewMode && (
                      <>
                        <button className='deleteTab' onClick={() => deleteTab(tab.id, index)}><p>X</p></button>
                        <button className='addTab' onClick={() => addItem(tab.id)}><p>+</p></button>
                      </>
                    )}
                    <div className='start'></div>
                    <div className='strings'>
                      {Array.from({length: 6}, (_, k) => (
                        <hr key={k}></hr>
                      ))}
                    </div>
                    <div className='end'></div>
                      {Array.from({ length: tab.notes }, (_, i) => (
                        <div key={i} className='fret'>
                          {Array.from({ length: 6 }, (_, j) => (
                            <input
                            key={j}
                            className={viewMode ? 'hiddenBorders' : 'visibleBorders'}
                            placeholder={
                              fillTabs[index] && fillTabs[index][i] && fillTabs[index][i][j]
                                ? fillTabs[index][i][j]
                                : ""
                            }
                            id={fillTabs[index] && fillTabs[index][i] && fillTabs[index][i][j] && fillTabs[index][i][j] != "" ? 'hasInput' : ''}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => handleChange(e, index, i, j)}
                          />
                          ))}
                      </div>
                    ))}
                  </div>
                )
              );
            })}
          </>
        )}
      </div>
      <div className='saveDiv'>
          <input placeholder='Tab name' onChange={(e) => setFileName(e.target.value)}></input>
        <button onClick={saveNotes}>Save</button>
        <button onClick={() => {(viewMode == true) ? setViewMode(false) : setViewMode(true)}}>View mode</button>
      </div>
    </>
  );
}

export default App;
