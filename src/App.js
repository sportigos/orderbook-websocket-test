import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import styled from "@emotion/styled";
import PriceTable from './PriceTable';

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #242d3c;
`;

const TopBar = styled.div`
  height: 64px;
  display: flex;
  margin: 10px 10px 1px;
  flex-direction: row;
  background-color: #111827;
  border-radius: 5px;
`;

const Title = styled.p`
  color: white;
  font-weight: 500;
  margin-left: 20px;
  text-align: center;
  font-weight: bold;
`;

const MainPageWrapper = styled.div`
  background-color: #111827;
  margin: 5px 10px;
  padding: 12px 0;
  border-radius: 3px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MainPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  border-radius: 3px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const BottomBar = styled.div`
  height: 64px;
  display: flex;
  margin: 1px 10px 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Button = styled.button`
  outline: none;
  border: none;
  background-color: ${(p) => p.color};
  border-radius: 10px;
  line-height: 23px;
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: bold;
  width: 200px;
  height: 48px;
  margin: 0 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

function App() {
  const [bidsData, setBidsData] = useState({});
  const [asksData, setAsksData] = useState({});
  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);
  let updateDataList = [];

  useEffect(() => {
    ws.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    ws.current.onopen = () => {
      // console.log("ws opened");
      ws.current.send('{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}');
    }
    ws.current.onclose = () => console.log("ws closed");

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = e => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      funcProcData(message);
    };
  }, [isPaused]);

  // useEffect(() => {
  //   const interval = setInterval(funcUpdateData, 3 * 1000);
  //   return () => clearInterval(interval);
  // }, []);


  const funcProcData = (data) => {
    // console.log("e", data);
    if (data.feed === "book_ui_1_snapshot") {
      let newBidsData = {}
      data.bids.map(item => (
        newBidsData = { ...newBidsData, [parseFloat(item[0]).toFixed(2)]: { size: item[1], total: 0 } }
      ))

      let newAsksData = {}
      data.asks.map(item => (
        newAsksData = { ...newAsksData, [parseFloat(item[0]).toFixed(2)]: { size: item[1], total: 0 } }
      ))

      newBidsData = sortObj(newBidsData)
      newAsksData = sortObj(newAsksData)
      setBidsData(newBidsData);
      setAsksData(newAsksData);
    } else if (data.feed === "book_ui_1") {
      if (data.bids && data.asks) {
        updateDataList = [...updateDataList, data]
        // console.log("funcProcData: updateDataList length", updateDataList.length)
      }
    }
  }

  const funcUpdateData = () => {
    let dataList = [...updateDataList]
    updateDataList = []
    // console.log("funcUpdateData: updateDataList length", updateDataList.length)

    let newBidsData = { ...bidsData }
    let newAsksData = { ...asksData }

    dataList.map(data => {
      data.bids.map(item => {
        newBidsData = { ...newBidsData, [parseFloat(item[0]).toFixed(2)]: { size: item[1], total: 0 } }
      })

      data.asks.map(item => {
        newAsksData = { ...newAsksData, [parseFloat(item[0]).toFixed(2)]: { size: item[1], total: 0 } }
      })
    })

    for (var key in newBidsData) {
      if (newBidsData[key].size == 0) delete newBidsData[key];
    }

    for (var key in newAsksData) {
      if (newAsksData[key].size == 0) delete newAsksData[key];
    }

    newBidsData = sortObj(newBidsData)
    newAsksData = sortObj(newAsksData)
    setBidsData(newBidsData)
    setAsksData(newAsksData)
  }

  const sortObj = obj => {
    let total = 0

    let sortedObj = Object.keys(obj).sort().reduce(function (result, key) {
      total += obj[key].size
      result[key] = { ...obj[key], total: total };
      return result;
    }, {});

    sortedObj = { ...sortedObj, total: total }

    return sortedObj
  }

  return (
    <Section>
      <TopBar>
        <Title>Order Book</Title>
      </TopBar>
      <MainPageWrapper>
        <MainPage>
          <PriceTable type="bid" data={bidsData}></PriceTable>
          <PriceTable type="ask" data={asksData}></PriceTable>
        </MainPage>
      </MainPageWrapper>
      <BottomBar>
        <Button color={"#5741d9"}>Toggle Feed</Button>
        <Button color={"#b91d1d"}>Kill Feed</Button>
      </BottomBar>
    </Section>
  );
}

export default App;
