import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

let SDKAppID = '1400149648';
const pattern =
  /((2(5[0-5]|[0-4]\d))|[01]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[01]?\d{1,2})){3}/g;
if (
  !!location.hostname.match(/(dev|integration|stable|localhost|perf)/) ||
  pattern.test(location.hostname)
) {
  SDKAppID = '1400331772'; // 测试库
}
let options = {
  SDKAppID,
};
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn//SDK.html#setLogLevel">setLogLevel 接口的说明</a>
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册腾讯云即时通信 IM 上传插件
tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
export default tim;
