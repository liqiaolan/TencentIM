/// <reference path="../../../../typings.d.ts" />

import TIM from 'tim-js-sdk';
import tim from './init';

interface Ilogin {
  serID: string;
  userSig: string;
}
interface IhandleListener {
  handleListener: () => void;
}
interface IcreateMessage {
  targetId: string;
  targetType: 1 | 2;
  text?: string;
  file?: File;
  data?: Record<string, any>;
  count?: number;
  nextReqMessageID?: string;
}
/**
 * 登录即时通信接口
 * @param {userID,userSig} options
 */
const loginIM = (option: any) => {
  let promise = tim.login(option);
  if (promise) {
    promise
      .then(function (imResponse: any) {
        // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
        if (imResponse.data.repeatLogin === true) {
          console.log('重复登录');
        } else {
          console.log('第一次登录');
        }
      })
      .catch(function (imError: any) {
        console.warn('login error:', imError); // 登录失败的相关信息
      });
  }
};
/**
 * 退出登录即时通信接口
 */
const logoutIM = () => {
  let promise = tim.logout();
  promise
    .then(function (imResponse: any) {
      console.log(imResponse.data); // 登出成功
    })
    .catch(function (imError: any) {
      console.warn('logout error:', imError);
    });
};
/**
 * 注入监听事件，监听消息实时更新
 * 返回event结果 ，目前只注册使用到的
 * event.name - TIM.EVENT.MESSAGE_RECEIVED
 * event.data - 存储 Message 对象的数组 - [Message]
 * name类型： sdkStateReady ｜ sdkStateNotReady
 *           onMessageReceived ｜ onMessageModified
 *           onMessageRevoked  ｜ onMessageReadByPeer
 *           onConversationListUpdated  ｜   onGroupListUpdated
 *           onGroupAttributesUpdated   ｜   onProfileUpdated
 *           onBlacklistUpdated    ｜    onFriendListUpdated
 *           onFriendGroupListUpdated  ｜   onFriendApplicationListUpdated
 *           onKickedOut    ｜     onError
 *           onNetStateChange   ｜   onSDKReload
 *
 * SDK进入ready状态时触发TIM.EVENT.SDK_READY,ready成功后才可调发送消息等api
 */
const onListener = (handleListener: IhandleListener) => {
  // 等待 sdk 处于 ready 状态
  tim.on(TIM.EVENT.SDK_READY, handleListener);
  // sdk不处于ready状态
  tim.on(TIM.EVENT.SDK_NOT_READY, handleListener);
  // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, handleListener);
  // SDK 收到消息被第三方回调修改的通知
  // tim.on(TIM.EVENT.MESSAGE_MODIFIED, handleListener);
  // SDK 收到消息被撤回的通知
  // tim.on(TIM.EVENT.MESSAGE_MODIFIED, handleListener);
  // SDK 收到对端已读消息的通知，即已读回执
  // tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, handleListener);
  // 会话列表更新，event.data 是包含 Conversation 对象的数组
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, handleListener);
  // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
  // tim.on(TIM.EVENT.GROUP_LIST_UPDATED, handleListener);
  // v2.14.0起支持。群属性更新时触发，可通过 event.data 获取到更新后的群属性数据
  // tim.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, handleListener);
  // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
  // tim.on(TIM.EVENT.PROFILE_UPDATED, handleListener);
  // SDK 黑名单列表更新时触发
  // tim.on(TIM.EVENT.BLACKLIST_UPDATED, handleListener);
  // 好友列表更新时触发
  // tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, handleListener);
  // 好友分组列表更新时触发
  // tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, handleListener);
  // SDK 好友申请列表更新时触发
  // tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, handleListener);
  // 用户被踢下线时触发
  tim.on(TIM.EVENT.KICKED_OUT, handleListener);
  // SDK 遇到错误时触发
  tim.on(TIM.EVENT.ERROR, handleListener);
  // 网络状态发生改变
  // tim.on(TIM.EVENT.NET_STATE_CHANGE, handleListener);
  /**
   * @description
   * 长时间断网后重新接入网络或者小程序长时间切后台又切回前台，
   * SDK 为了和 IM 服务器进行状态及消息同步，需要重载
   * 接入方一般不考虑所以不导出
   */
  // tim.on(TIM.EVENT.SDK_RELOAD, handleListener);
};
/**
 *取消监听事件
 */
const offListener = (handleListener: IhandleListener) => {
  tim.off(TIM.EVENT.MESSAGE_RECEIVED, handleListener);
  tim.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, handleListener);
  tim.off(TIM.EVENT.ERROR, handleListener);
};
/**
 * 初始化接口 initializeIM
 * 让用户调用一个API，实现登录和监听事件
 * option为登录所需参数 handleListener为注册事件回调
 */
const initializeIM = (option: Ilogin, handleListener: IhandleListener) => {
  onListener(handleListener);
  loginIM(option);
};
/**
 * 创建文本消息接口
 * TIM.TYPES.CONV_GROUP 群聊
 * TIM.TYPES.CONV_C2C 个人
 */
const createTextMessageIM = (option: IcreateMessage) => {
  const { targetId, targetType, text = '' } = option;
  return tim.createTextMessage({
    to: targetId,
    conversationType:
      targetType === 1 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP,
    payload: {
      text: text,
    },
  });
};
/**
 * 创建图片消息接口
 */
const createImageMessageIM = (option: IcreateMessage) => {
  const { targetId, targetType, file } = option;
  return tim.createImageMessage({
    to: targetId,
    conversationType:
      targetType === 1 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP,
    payload: {
      file,
    },
  });
};
/**
 * 创建音频消息接口
 */
const createAudioMessageIM = (option: IcreateMessage) => {
  const { targetId, targetType, file } = option;
  return tim.createAudioMessage({
    to: targetId,
    conversationType:
      targetType === 1 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP,
    payload: {
      file,
    },
  });
};
/**
 * 创建视频消息接口
 */
const createVideoMessageIM = (option: IcreateMessage) => {
  const { targetId, targetType, file } = option;
  return tim.createVideoMessage({
    to: targetId,
    conversationType:
      targetType === 1 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP,
    payload: {
      file,
    },
  });
};
/**
 * 创建自定义消息接口
 */
const createCustomMessageIM = (option: IcreateMessage) => {
  const { targetId, targetType, data } = option;
  return tim.createCustomMessage({
    to: targetId,
    conversationType:
      targetType === 1 ? TIM.TYPES.CONV_C2C : TIM.TYPES.CONV_GROUP,
    payload: {
      data: JSON.stringify(data),
      description: '',
      extension: '',
    },
  });
};
/**
 * 将某会话下的未读消息状态设置为已读
 * conversationID	String	会话 ID。会话 ID 组成方式：
 * C2C${userID}（单聊）
 * GROUP${groupID}（群聊）
 * @TIM#SYSTEM（系统通知会话）
 */
const setMessageReadIM = (option: any) => {
  const { targetId, targetType } = option;
  let promise = tim.setMessageRead({
    conversationID: targetType === 1 ? `C2C${targetId}` : `GROUP${targetId}`,
  });
  promise
    .then(function (imResponse: any) {
      console.log(imResponse, 'imResponse已读成功');
      // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
    })
    .catch(function (imError: any) {
      // 已读上报失败
      console.warn('setMessageRead error:', imError);
    });
};
/**
 * 分页拉取指定会话的消息列表的接口
 * conversationID  同上
 * nextReqMessageID ：用于分页续拉的消息 ID。第一次拉取时该字段可不填，
 *                    每次调用该接口会返回该字段，续拉时将返回字段填入即可。
 * count 需要拉取的消息数量，默认值和最大值为15，即一次拉取至多返回15条消息
 */
const getMessageListIM = async (option: IcreateMessage) => {
  const { targetId, targetType, count, nextReqMessageID = '' } = option;
  let promise = await tim.getMessageList({
    conversationID: targetType === 1 ? `C2C${targetId}` : `GROUP${targetId}`,
    nextReqMessageID,
    count: count || 15,
  });
  /**
   * @description
   * imResponse.data.messageList  消息列表
   * imResponse.data.nextReqMessageID  // 用于续拉，分页续拉时需传入该字段
   * imResponse.data.isCompleted // 表示是否已经拉完所有消息。
   */
  return promise.data;
};
/**
 * 获取会话列表的接口
 * imResponse.data.conversationList // 会话列表，用该列表覆盖原有的会话列表
 */
const getConversationListIM = async () => {
  // 拉取会话列表
  let promise = await tim.getConversationList();
  return promise.data || [];
};
/**
 * 发送消息接口
 * @param { msgType ,data } options
 * msgType表示发送文本类型  data表示发送内容对象
 * msgType: text | image | audio | video | custom
 */
const sendMessageIM = async (
  msgType: string | Record<string, any>,
  msgData: Record<string, any>,
) => {
  let type = '',
    data: IcreateMessage = {
      targetId: '',
      targetType: 1,
    };
  if (typeof msgType === 'object') {
    //H5格式
    type = msgType.type || 'text';
    data = {
      ...data,
      ...msgType.content,
    };
  } else {
    type = msgType;
    data = {
      ...data,
      ...msgData,
    };
  }
  let message = null;
  switch (type) {
    case 'text':
      message = createTextMessageIM(data);
      break;
    case 'image':
      message = createImageMessageIM(data);
      break;
    case 'audio':
      message = createAudioMessageIM(data);
      break;
    case 'video':
      message = createVideoMessageIM(data);
      break;
    case 'custom':
      message = createCustomMessageIM(data);
      break;
    default:
      message = createTextMessageIM(data);
      break;
  }
  if (message) {
    let promise = await tim.sendMessage(message);
    return promise.data;
  } else {
    return false;
  }
};

new Promise((resolve, reject) => {
  reject(1);
})
  .then((res) => {
    console.log(res, 'then');
  })
  .catch((err) => {
    console.log(err, 'catch');
  });

export default {
  initializeIM,
  logoutIM,
  offListener,
  setMessageReadIM,
  getMessageListIM,
  getConversationListIM,
  sendMessageIM,
};
