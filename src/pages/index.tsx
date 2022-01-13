import React, { useState, useEffect } from 'react';
import {
  loginIM,
  logoutIM,
  onListener,
  offListener,
  setMessageReadIM,
  getMessageListIM,
  getConversationListIM,
  sendMessageIM,
} from '../utils/chat.js';

const Home = () => {
  const [nextReqMessageID, setNextReqMessageID] = useState('');
  let loginOption = {
    accountId: '910300000369346974',
    userSig:
      'eJw1js0OgjAQhN+lVw32jxZMvHDpQeEAxPRq0oKrQSsQxBjfXWhgb7PfzGS+qDwVgR0dtBbtEQmliPB8aOvJYNvpTYNVd+Z+cQ7M7OUYM0akpAsDYx89VOAjMcHMFzERMy5iydcGqCf8LqyRqqNQZsPxqUf9UbuNTJNXnmRO3fKo1uf62uTUpYcl2EPjJwrCw4hSzNHvDzx/NFQ=',
  };
  const handleListener = (event) => {
    const { name, data } = event;
    switch (name) {
      case 'sdkStateReady':
        console.log('isSDKReady链接了');
        break;
      case 'sdkStateNotReady':
        console.log('isSDKReady不链接了');
        break;
      case 'onMessageReceived':
        console.log('收到聊天新消息了');
        break;
      case 'onConversationListUpdated':
        console.log('会话列表更新');
        break;
      case 'onKickedOut':
        console.log('用户被踢下线');
        break;
      case 'onError':
        console.log('遇到错误时触发');
        break;
      default:
        break;
    }
    console.log(event);
    // setIsSDKReady(true);
  };
  onListener(handleListener);
  loginIM({
    userID: loginOption.accountId,
    userSig: loginOption.userSig,
  });

  return (
    <div>
      <button
        onClick={() =>
          sendMessageIM('text', {
            targetId: '1679025291948756995',
            targetType: 1,
            text: '腾讯发的小程序文本消息1',
          })
        }
      >
        发送文本消息
      </button>
      <input
        type="file"
        id="imagePicker"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files;
          if (file) {
            sendMessageIM('image', {
              targetId: '1679025291948756995',
              targetType: 1,
              file: file[0],
            });
          }
        }}
      />

      <button
        onClick={() =>
          sendMessageIM('custom', {
            targetId: '1679025291948756995',
            targetType: 1,
            data: {
              objectName: 'RCD:WMMixContentCardMsg',
              content: JSON.stringify({
                contents: [
                  {
                    key: '医生你好，我已完成此量表填写，请您查看！',
                    keyStyle: '3',
                    value: '',
                    valueStyle: '0',
                  },
                ],
                customerAccessUrl:
                  'http://dev1.m.myweimai.com/new/healthscale/evaluation_result.html?recordId=1602962281812054017',
                doctorAccessUrl:
                  'http://dev1.m.myweimai.com/doctor/healthscale/evaluation_result.html?recordId=1602962281812054017',
                extra:
                  '{"serverMsgSendInfo":"{\\"isCounted\\":1,\\"isIncludeSender\\":1,\\"pushContent\\":\\"甲状腺患者术后随访\\",\\"sendServerMsgMQ\\":true,\\"source\\":\\"server\\",\\"version\\":1}"}',
                img: 'https://img-app.qstcdn.com/weimaiyiliaopic/2020/06/17/pic2.png',
                pushContent: '甲状腺患者术后随访',
                scene: '8',
                tip: {
                  customerTip: '查看测评结果',
                  customerTipStyle: '3',
                  doctorTip: '查看测评结果',
                  doctorTipStyle: '3',
                },
                title: '甲状腺患者术后随访',
              }),
            },
          })
        }
      >
        发送自定义信息
      </button>
      <button>发送语音消息</button>
      <input
        type="file"
        accept="*"
        onChange={(e) => {
          const file = e.target.files;
          // console.log(file)
          // console.log(file[0])
          if (file) {
            sendMessageIM('video', {
              targetId: '1679025291948756995',
              targetType: 1,
              file: file[0],
            });
          }
        }}
      ></input>

      <button onClick={() => logoutIM()}>退出登录</button>
      <button
        onClick={() =>
          sendMessageIM({
            type: 'text',
            content: {
              targetId: '1679025291948756995',
              targetType: 1,
              text: '测试H5的数据',
            },
          })
        }
      >
        H5发送文本消息
      </button>
      <button onClick={() => offListener(handleListener)}>取消监听事件</button>
      <button
        onClick={async () => {
          let res = await getMessageListIM({
            targetId: '1679025291948756995',
            targetType: 1,
            nextReqMessageID,
          });
          console.log(res);
          if (res && !res.isCompleted) {
            setNextReqMessageID(res.nextReqMessageID);
          }
        }}
      >
        获取历史消息
      </button>
      <button
        onClick={() => {
          let res = setMessageReadIM({
            targetId: '1679025291948756995',
            targetType: 1,
          });
          console.log(res);
        }}
      >
        设置已读
      </button>
      <button
        onClick={async () => {
          let res = await getConversationListIM();
          console.log(res);
        }}
      >
        获取会话列表
      </button>
    </div>
  );
};

export default Home;
