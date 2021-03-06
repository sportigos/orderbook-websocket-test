import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import styled from "@emotion/styled";
import PriceTable from './components/PriceTable';
import Select, { StylesConfig } from 'react-select'
import { TicketOptionType, PriceItem, SizeBox, PriceList, FeedData } from './Interfaces';

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
  flex-direction: row;
  align-items: center;
  margin: 10px 10px 1px;
  background-color: #111827;
  border-radius: 5px;
  position: relative;
`;

const Title = styled.p`
  color: white;
  font-weight: 500;
  margin-left: 20px;
  text-align: center;
  font-weight: bold;
`;

const SelectWrapper = styled.div`
  position: absolute;
  right: 80px;
  z-index: 100;
  font-weight: 500;
`;

const MainPageWrapper = styled.div`
  display: flex;
  flex: 1;
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
  flex-direction: column-reverse;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
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

const ticketOptionsXBT: TicketOptionType[] = [
  { value: 0.5, label: 'Group 0.5' },
  { value: 1.0, label: 'Group 1.0' },
  { value: 2.5, label: 'Group 2.5' }
]

const ticketOptionsETH: TicketOptionType[] = [
  { value: 0.05, label: 'Group 0.05' },
  { value: 0.1, label: 'Group 0.1' },
  { value: 0.25, label: 'Group 0.25' }
]

const ticketSelectStyles: StylesConfig<TicketOptionType, false> = {
  control: (provided) => ({
    ...provided,
    width: 140,
    background: "#374151",
    borderRadius: 5,
    border: 0,
    boxShadow: 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white'
  }),
  indicatorSeparator: (provided) => ({ ...provided, display: "none" }),
};

const wssURL = "wss://www.cryptofacilities.com/ws/v1"
const msgXBTUSDSub = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const msgETHUSDSub = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
const msgXBTUSDUnsub = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const msgETHUSDUnSub = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'

function App() {
  const [subscribed, setSubscribed] = useState(false);
  const [needUpdate, setNeedUpdate] = useState({ update: true });
  const [ticketFilterdData, setTicketFilterdData] = useState({ bids: {}, asks: {} });
  const [bXBTUSD, setXBTUSD] = useState(true);
  const [ticketSelected, setTicketSelected] = useState(ticketOptionsXBT[0]);
  let websocket = useRef<WebSocket>();
  let orgData = useRef<PriceList>({ bids: {}, asks: {} })
  let updateDataList = useRef<FeedData[]>([]);
  let throwerror = useRef(true)

  const connWebSocket = () => {
    websocket.current = new WebSocket(wssURL);
    websocket.current.onopen = () => {
      console.log("ws opened");
      websocket.current?.send(msgXBTUSDSub);
    }
    websocket.current.onclose = () => {
      console.log("ws closed");
    }
    websocket.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
    websocket.current.onmessage = e => {
      const message = JSON.parse(e.data);

      if (message.event === "subscribed")
        setSubscribed(true)
      else if (message.event === "unsubscribed")
        setSubscribed(false)
      else
        funcReceiveData(message);
    };

    return () => {
      websocket.current?.close();
    };
  }

  useEffect(connWebSocket, []);

  useEffect(() => {
    const interval = setInterval(() => { setNeedUpdate({ update: true }) }, 1 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (websocket.current?.readyState === WebSocket.OPEN) {
      if (subscribed === false && bXBTUSD === true)
        websocket.current?.send(msgXBTUSDSub)
      else if (subscribed === false && bXBTUSD === false)
        websocket.current?.send(msgETHUSDSub)
    }
  }, [subscribed, bXBTUSD]);

  useEffect(() => {
    const funcProcData = () => {
      let dataList = [...updateDataList.current]
      updateDataList.current = []

      let newBidsData: PriceItem = { ...orgData.current.bids }
      let newAsksData: PriceItem = { ...orgData.current.asks }

      dataList.forEach((data: FeedData) => {
        data.bids.forEach((item: number[]) => {
          if (item[1] === 0)
            delete newBidsData[item[0].toFixed(2)]
          else
            newBidsData = { ...newBidsData, [item[0].toFixed(2)]: { size: item[1] } }
        })

        data.asks.forEach((item: number[]) => {
          if (item[1] === 0)
            delete newAsksData[item[0].toFixed(2)]
          else
            newAsksData = { ...newAsksData, [item[0].toFixed(2)]: { size: item[1] } }
        })
      })

      orgData.current = { bids: newBidsData, asks: newAsksData }

      let sortfilteredBidsData = funcTicketFilterData(orgData.current.bids)
      let sortfilteredAsksData = funcTicketFilterData(orgData.current.asks)
      setTicketFilterdData({ bids: sortfilteredBidsData, asks: sortfilteredAsksData })
    }

    const funcTicketFilterData = (data: PriceItem) => {
      let newData: PriceItem = {}
      let total = 0

      Object.keys(data).forEach(key => {
        total += (data[key] as SizeBox).size
        let nearestPrice = (Math.floor(parseFloat(key) / ticketSelected.value) * ticketSelected.value).toFixed(2)
        if (newData[nearestPrice] === undefined)
          newData[nearestPrice] = { size: (data[key] as SizeBox).size }
        else
          newData[nearestPrice] = { size: (newData[nearestPrice] as SizeBox).size + (data[key] as SizeBox).size }
      })

      newData = { ...newData, total: total }

      return newData
    }

    funcProcData()

  }, [needUpdate, ticketSelected]);

  const onToggleFeed = () => {
    if (bXBTUSD === true) {
      websocket.current?.send(msgXBTUSDUnsub)
      setTicketSelected(ticketOptionsETH[0]);
    } else {
      websocket.current?.send(msgETHUSDUnSub)
      setTicketSelected(ticketOptionsXBT[0]);
    }

    setXBTUSD(!bXBTUSD)
  }

  const onKillFeed = () => {
    if (throwerror.current === true) {
      websocket.current?.close()
      websocket.current = new WebSocket("wss://www.cryptofacilities.com/wsssss/v1");
      websocket.current.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      orgData.current = { bids: {}, asks: {} }
      updateDataList.current = []
    } else {
      connWebSocket()
    }
    throwerror.current = !throwerror.current
  }

  const onTicketSelChange = (selectedOption: any) => {
    setTicketSelected(selectedOption);
  }

  const funcReceiveData = (data: FeedData) => {
    // console.log("e", data);
    if (data.feed === "book_ui_1_snapshot") {
      orgData.current = { bids: {}, asks: {} }
      updateDataList.current = []
    }

    if (data.bids && data.asks) {
      updateDataList.current = [...updateDataList.current, data]
    }

    if (data.feed === "book_ui_1_snapshot") {
      setNeedUpdate({ update: true })
    }
  }

  return (
    <Section>
      <TopBar>
        <Title>Order Book</Title>
        <SelectWrapper>
          <Select
            styles={ticketSelectStyles}
            options={bXBTUSD ? ticketOptionsXBT : ticketOptionsETH}
            isSearchable={false}
            value={ticketSelected}
            onChange={onTicketSelChange}
          />
        </SelectWrapper>
      </TopBar>
      <MainPageWrapper>
        <MainPage>
          <PriceTable tbltype="bid" data={ticketFilterdData.bids}></PriceTable>
          <PriceTable tbltype="ask" data={ticketFilterdData.asks}></PriceTable>
        </MainPage>
      </MainPageWrapper>
      <BottomBar>
        <Button color={"#5741d9"} onClick={onToggleFeed}>Toggle Feed</Button>
        <Button color={"#b91d1d"} onClick={onKillFeed}>Kill Feed</Button>
      </BottomBar>
    </Section>
  );
}

export default App;
