import arch from "../../assets/architecture.png";
import autonomy from "../../assets/autonomy.png";
import easy from "../../assets/easy.png";
import unit from "../../assets/unit.png";
import tunnel from "../../assets/tunnel.png";
import Animate from "rc-animate";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const introList = [
  {
    img: autonomy,
    title: "边缘自治",
    desc: `当边缘节点处于离线状态或边缘网络间歇性断联时，保证业务容器可以持续运行在边缘节点上。这意味着即使节点重启,
    边缘业务容器仍可自动恢复。同时当网络恢复正常后，边缘节点自动同步业务容器最新状态，确保应用持续无缝地运行。`,
  },
  {
    img: tunnel,
    title: "云边协同",
    desc: `为位于Intranet内部的边缘节点提供安全的云边双向认证的加密通道，确保在边到云网络单向连通的边缘计算场景下，用户仍可运行原生kubernetes运维命令(如kubectl exec/logs等)。同时中心式的运维监控系统(如prometheus, metrics-server等)也可以通过云边通道获取到边缘的监控数据。`,
  },
  {
    img: unit,
    title: "边缘单元化",
    desc: `从单元化的视角，轻松管理分散在不同地域的边缘资源，并对各地域单元内的业务提供独立的生命周期管理，升级，扩缩容，流量闭环等能力。且业务无需进行任何适配或改造。`,
  },
  {
    img: easy,
    title: "无缝转换",
    desc: `提供yurtctl工具，方便用户一键式将原生Kubernetes集群转换为具备边缘能力的OpenYurt集群，或者将OpenYurt集群还原为原生Kubernetes集群。 同时OpenYurt组件运行所需的额外资源和维护成本很低。      `,
  },
];

// OpenYurt LOGO with short description
// display along with login/register form
// status ?
//  = loading: waiting for registering
//  = complete: register success or fail
//  = login: login form
//  = register: register form
export function IntroBlock({ status }) {
  const [id, setId] = useState(0);

  // switch the gallary content every 3s
  useEffect(() => {
    let handler;
    if (status === "loading") {
      handler = setInterval(
        () => setId((i) => (i + 1) % introList.length),
        3500
      );
    }
    return handler ? () => clearInterval(handler) : null;
  }, [status]);

  return status === "loading" || status === "complete" ? (
    // loading display
    <div style={{ marginTop: 50 }}>
      <LoadingGallary id={id} status={status} />
      <div className="login-intro-loading-tips">
        正在为您创建OpenYurt试用平台账号，请稍等
        <LoadingOutlined style={{ marginLeft: 8 }} />
      </div>
    </div>
  ) : (
    // login/register form display
    <div className="login-intro">
      <img src={arch} alt="openyurt-arch"></img>
      <div className="login-intro-word">
        Extending Kubernetes to Edge
        <a
          style={{ display: "block", fontSize: 21 }}
          href="https://openyurt.io/zh-cn/"
        >
          Learn More About OpenYurt &gt;
        </a>
      </div>
    </div>
  );
}

function LoadingGallary({ id }) {
  return (
    <Animate transitionName="fade" transitionLeave={false}>
      <LoadingBlock
        img={introList[id].img}
        title={introList[id].title}
        desc={introList[id].desc}
        key={id}
      ></LoadingBlock>
    </Animate>
  );
}

function LoadingBlock({ img, title, desc }) {
  return (
    <div className="login-intro-loading">
      <div className="login-intro-loading-col">
        <div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
      </div>
      <div className="login-intro-loading-image login-intro-loading-col">
        <img src={img} alt={title}></img>
      </div>
    </div>
  );
}
