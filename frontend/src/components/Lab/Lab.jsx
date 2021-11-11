import App from "./App";
import { Modal, Form } from "antd";
import { Input, Button, Select, DatePicker, InputNumber, Switch } from "antd";
import { useState } from "react";

export default function Lab() {
  const [isModalVisible, setModalVisible] = useState(false);
  //   const [modalConfig, setModaConfig] = useState(null);

  const appConfig = [
    {
      avatar:
        "https://th.bing.com/th/id/OIP.Q5K3ZcL44_iWH0CfOeyh-AHaHW?w=169&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
      title: "WordPress",
      desc: "WordPress是一个以PHP和MySQL为平台的自由开源的博客软件和内容管理系统。WordPress是最受欢迎的网站内容管理系统。全球有大约30%的网站都是使用WordPress架设网站的。",
      img: "https://websitesetup.org/wp-content/uploads/2018/03/cms-comparison-wordpress-vs-joomla-vs-drupal-wordpress-dashboard-1024x640.jpg",
    },
    {
      avatar:
        "https://camo.githubusercontent.com/79f2dcf6fb41b71619186b12eed25495fa55e20d3f21355798a2cb22703c6f8b/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30342f32332f356362656237653431343134632e706e67",
      title: "RSSHub",
      desc: "RSSHub 是一个开源、简单易用、易于扩展的 RSS 生成器，可以给任何奇奇怪怪的内容生成 RSS 订阅源。RSSHub 借助于开源社区的力量快速发展中，目前已适配数百家网站的上千项内容。",
      img: "https://store-images.s-microsoft.com/image/apps.26097.717f8ad3-f5cc-479d-8b33-e34b63ca5b78.48a82a81-a971-4050-876d-2cdd1190f1e8.debf4886-b41e-4d62-b442-ebd6b7f6b2c9",
    },
    {
      avatar:
        "https://th.bing.com/th/id/OIP.ruxnNw4E8mxjHrWC1SA-RgAAAA?w=115&h=124&c=7&r=0&o=5&dpr=2&pid=1.7",
      title: "TinyTinyRSS",
      desc: "Tiny Tiny RSS是一个受欢迎的基于Web的开源新闻提要(RSS/Atom)聚合器，旨在让你从任何地方阅读新闻。它是一个安装在Web服务器上的Web应用程序，并提供了丰富的可定制化功能。",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8iwhmFTlhnFG_ari3OFcElThvQHTx_cvvfg&usqp=CAU",
    },
  ];

  return (
    <div>
      <div>
        <h2>OpenYurt Lab</h2>
        <h4>通过OpenYurt一键部署下列样例程序到你的服务器。</h4>
      </div>

      <div
        style={{
          display: "flex",
        }}
      >
        {appConfig.map((item, index) => (
          <App
            key={index}
            avatar={item.avatar}
            desc={item.desc}
            img={item.img}
            title={item.title}
            setConfig={() => {
              setModalVisible(true);
              // fetch according to selected item information
              console.log(item);
            }}
          ></App>
        ))}
      </div>

      <Modal
        width="50%"
        title="WordPress"
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button type="primary" onClick={() => setModalVisible(false)}>
            部署
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
        >
          <Form.Item label="Name">
            <Input />
          </Form.Item>
          <Form.Item label="Node">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="DatePicker">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Port">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Switch" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
