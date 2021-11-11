import { Card, Avatar } from "antd";
import { LinkOutlined, SettingOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function App({ title, desc, setConfig, img, avatar }) {
  return (
    <Card
      style={{ width: 350, margin: "20px 10px" }}
      cover={<img alt="example" src={img} />}
      hoverable={true}
      bordered={true}
      actions={[
        <SettingOutlined key="setting" onClick={setConfig} />, // setting modals
        <LinkOutlined key="link" />, // link to the services homepage
      ]}
    >
      <Meta avatar={<Avatar src={avatar} />} title={title} description={desc} />
    </Card>
  );
}
