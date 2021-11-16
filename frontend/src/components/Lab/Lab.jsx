import App from "./App";
import { Modal, Form, message } from "antd";
import { Input, Button, InputNumber, Switch } from "antd";
import { useEffect, useState } from "react";
import { getDeployments, getNodes, sendUserRequest } from "../../utils/request";

function useModalConfig(refreshConfigList) {
  const initConfigList = [
    {
      app: "RSSHub",
      created: false,
      avatar:
        "https://camo.githubusercontent.com/79f2dcf6fb41b71619186b12eed25495fa55e20d3f21355798a2cb22703c6f8b/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30342f32332f356362656237653431343134632e706e67",
      desc: "RSSHub 是一个开源、简单易用、易于扩展的 RSS 生成器，可以给任何奇奇怪怪的内容生成 RSS 订阅源。RSSHub 借助于开源社区的力量快速发展中，目前已适配数百家网站的上千项内容。",
      img: "https://store-images.s-microsoft.com/image/apps.26097.717f8ad3-f5cc-479d-8b33-e34b63ca5b78.48a82a81-a971-4050-876d-2cdd1190f1e8.debf4886-b41e-4d62-b442-ebd6b7f6b2c9",
      dpName: "lab-rsshub-dp",
      service: false,
      port: 3000,
    },
    {
      app: "TinyTinyRSS",
      created: false,
      avatar:
        "https://th.bing.com/th/id/OIP.ruxnNw4E8mxjHrWC1SA-RgAAAA?w=115&h=124&c=7&r=0&o=5&dpr=2&pid=1.7",
      desc: "Tiny Tiny RSS是一个受欢迎的基于Web的开源新闻提要(RSS/Atom)聚合器，旨在让你从任何地方阅读新闻。它是一个安装在Web服务器上的Web应用程序，并提供了丰富的可定制化功能。",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8iwhmFTlhnFG_ari3OFcElThvQHTx_cvvfg&usqp=CAU",
      dpName: "lab-ttrss-dp",
      service: false,
      port: 181,
    },
    {
      app: "WordPress",
      created: false,
      avatar:
        "https://th.bing.com/th/id/OIP.Q5K3ZcL44_iWH0CfOeyh-AHaHW?w=169&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
      desc: "WordPress是一个以PHP和MySQL为平台的自由开源的博客软件和内容管理系统。WordPress是最受欢迎的网站内容管理系统。全球有大约30%的网站都是使用WordPress架设网站的。",
      img: "https://websitesetup.org/wp-content/uploads/2018/03/cms-comparison-wordpress-vs-joomla-vs-drupal-wordpress-dashboard-1024x640.jpg",
      dpName: "lab-wordpress-dp",
      service: false,
      port: 80,
    },
  ];

  const [modalConfigList, setConfigList] = useState(initConfigList);
  const [selectedModal, setSelected] = useState(0);
  useEffect(() => {
    getDeployments().then((dpList) =>
      setConfigList((oldConfigList) => refreshConfigList(oldConfigList, dpList))
    );
  }, [refreshConfigList]);

  // update APP config
  const setConfig = (newConfig) => {
    modalConfigList[selectedModal] = Object.assign(
      modalConfigList[selectedModal],
      newConfig
    );
    setConfigList([...modalConfigList]);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTip, setTip] = useState(null);

  return [
    isModalVisible,
    modalTip,
    modalConfigList,
    modalConfigList[selectedModal],
    (id) => {
      setSelected(id);
      setModalVisible(true);
    },
    () => {
      setModalVisible(false);
      setTip(null);
    },
    setConfig,
    setTip,
  ];
}

function updateConfigList(oldConfigList, dpList) {
  const labDpList = dpList
    .filter((dp) => dp.tag && dp.tag.type && dp.tag.type === "lab")
    .map((dp) => ({
      ...dp.tag,
      created: true,
      dpName: dp.title,
    }));

  const combineItemByName = (name) =>
    Object.assign(
      oldConfigList.find((config) => config.app === name),
      labDpList.find((dp) => dp.app === name)
    );

  return ["RSSHub", "TinyTinyRSS", "WordPress"].map(combineItemByName);
}

export default function Lab() {
  const [
    isModalVisible,
    modalTip,
    appList,
    modalConfig,
    openModal,
    closeModal,
    setConfig,
    setTip,
  ] = useModalConfig(updateConfigList);

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
        {appList.map((item, index) => (
          <App
            key={index}
            avatar={item.avatar}
            desc={item.desc}
            img={item.img}
            title={item.app}
            status={item.created === true}
            setConfig={() => {
              openModal(index);
            }}
          ></App>
        ))}
      </div>

      <Modal
        width="45%"
        title={modalConfig.app}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button
            type="primary"
            disabled={modalConfig.created}
            onClick={doDeploy}
          >
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
          <Form.Item label="Name" tooltip="Deployment名称">
            <Input
              value={modalConfig.dpName}
              disabled={modalConfig.created}
              onChange={(e) => {
                setConfig({
                  dpName: e.target.value,
                });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Service"
            tooltip="是否通过Service将应用以NodePort的形式暴露出来（即可以通过节点IP访问该服务）"
          >
            <Switch
              disabled={modalConfig.created}
              checked={modalConfig.service}
              onChange={(val) =>
                setConfig({
                  service: val,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Port" tooltip="请注意不要使用可能引起冲突的端口">
            <InputNumber
              disabled={modalConfig.created || !modalConfig.service}
              value={modalConfig.port}
              onChange={(val) =>
                setConfig({
                  port: val,
                })
              }
            />
          </Form.Item>
        </Form>
        <div
          style={{
            color: "red",
          }}
        >
          {modalTip}
        </div>
      </Modal>
    </div>
  );

  async function doDeploy() {
    // fields check
    const dpNameRegex = new RegExp(
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
    );
    if (!modalConfig.dpName || !dpNameRegex.test(modalConfig.dpName)) {
      setTip("Tips: Deployment Name需要满足DNS subdomain的命名规范");
      return;
    }
    if (
      modalConfig.service &&
      (modalConfig.port < 0 || modalConfig.port > 65535)
    ) {
      setTip("Tips: 端口范围需要在0到65535之间");
      return;
    }

    const nodeList = await getNodes();
    if (nodeList.length === 0) {
      setTip("Tips: 请您先至少接入一个节点， 然后再尝试实验室功能😄。");
      return;
    }

    // create deployment
    sendUserRequest("/createDeployment", {
      DeploymentName: modalConfig.dpName,
    })
      .then((res) => {
        if (!("status" in res) || res.status !== "error") {
          message.info(res);
        }
      })
      .finally(closeModal);

    // create service if necessary
    if (modalConfig.service) {
    }
  }
}
