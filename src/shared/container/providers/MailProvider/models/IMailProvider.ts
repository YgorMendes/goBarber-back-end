export default interface IMailProvider {
  sendMail(tp: string, body: string): Promise<void>;
};