exports.mochaGlobalSetup = async function () {
    this.server = await startSomeServer({port: 1245});
    console.log(`server running on port ${this.server.port}`);
  };

exports.mochaGlobalTeardown = async function () {
    await this.server.stop();
    console.log('server stopped!');
};
  