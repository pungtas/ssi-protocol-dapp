import React from "react";
import * as ReactNative from 'react-native';
import * as Themed from './Themed';
import "./../../App.less";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { LABELS } from "../../constants";
import { AppBar } from "../AppBar";
import tyron_logo from "./tyron_logo.png";

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <div className="App wormhole-bg">
      <Layout title={LABELS.APP_TITLE}>
        <Header className="App-Bar">
          <Link to="/">
            <div className="app-title">
              <h2>Tyron: Self-Sovereign Identity Protocol x Decentralized application</h2>
            </div>
          </Link>
          <AppBar />
        </Header>
        <div>
          <img src={tyron_logo} alt="tyron_logo" title="tyron_logo" width="500"/>
        </div>
        <ReactNative.Text style={ Themed.styles.slogan }>own your data, empower your world</ReactNative.Text>
        <Content style={{ padding: "0 50px" }}>{props.children}</Content>
      </Layout>
    </div>
  );
});
