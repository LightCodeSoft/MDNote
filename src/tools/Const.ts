export const PasteFile = 0x0001; //粘贴文件
export const ReqReloadRootDir = 0x0002;//请求重新刷新根目录
// export const OnLoadRootDir = 0x0003;//完成根目录刷新
export const OpenInExplorer = 0x0004;//在文件管理器中打开
export const OnWebLoad = 0x0005;//网页完成加载
export const ReqOpenFile = 0x0006;//请求打开文件
export const OnOpenFile = 0x0007;//完成文件打开
export const ReqSaveFile = 0x0008;//请求保存文件
export const OnSaveFile = 0x0009;//已完成文件保存
export const OnKeydownSave = 0x0010;//ctrl+s
export const ReqRename = 0x0011; //请求重命名
export const ReqNewFileFolder = 0x0012;//请求创建文件或文件夹
export const ReqDelPath = 0x0013;//请求删除文件
export const OnEditing = 0x0014; //正在编辑
export const OnResetContent = 0x0015;//重置编辑内容
export const OnPreviewReady = 0x0016;//预览窗口已ready
export const ToggleEditPreviewMode = 0x0017;//请求设置编辑预览模式：预览、编辑、编辑+预览
export const ReqOpenURL = 0x0018;//请求打开网页
// export const IsFileSaved = 0x0019;//询问指定的文件是否已经保存
export const SetEditorEmpty = 0x0020;//清空编辑器内容
export const EditCommand = 0x0021;//发送编辑指令
export const Exit = 0x0022;//退出
export const ReqOpenDirDialog = 0x0023;//打开目录选择对话框
export const SwithLeftBar = 0x0024; //左侧切换页面
export const ReqCapture = 0x0025; //左侧切换页面
export const CopyText = 0x0026; //复制文本
export const ReadClipboardText = 0x0027; //读取剪切板中的文本
export const ReqOpenDir = 0x0028; //打开指定目录

// ==========新规范 调用函数=============//
export const CheckFileSaved = 0x1001; // 询问是否有文件未保存
export const OnSwitchFolder = 0x1002; // 切换目录item

// ==========Native 调用函数=============//
export const GetFolderList = 0x2001; // 获取所有目录
export const GetMDList = 0x2002; // 获取markdown文件列表
export const ReadFile = 0x2003; // 读取文件
export const GetCfgRoot = 0x2004; //获取配置文件根路径
