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

const MainPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  background-color: #111827;
  margin: 5px 10px;
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
  const [asksData, setAsksData] = useState([]);
  const [bidsData, setBidsData] = useState([]);
  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);

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
      updateData(message);
      // console.log("e", message);
    };
  }, [isPaused]);

  const updateData = (data) => {
    if (data.feed === "book_ui_1_snapshot") {
      let askData = data.asks.map(item => (
        { price: item[0], size: item[1], total: 0 }
      ))

      let bidData = data.bids.map(item => (
        { price: item[0], size: item[1], total: 0 }
      ))

      setAsksData(askData);
      setBidsData(bidData);
    }
  }

  return (
    <Section>
      <TopBar>
        <Title>Order Book</Title>
      </TopBar>
      <MainPage>
        <PriceTable data={asksData}></PriceTable>
        <PriceTable data={bidsData}></PriceTable>
      </MainPage>
      <BottomBar>
        <Button color={"#5741d9"}>Toggle Feed</Button>
        <Button color={"#b91d1d"}>Kill Feed</Button>
      </BottomBar>
    </Section>
  );
}

export default App;
