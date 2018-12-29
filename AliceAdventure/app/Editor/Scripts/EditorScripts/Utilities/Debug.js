class Debug {
  static Log(content) {
    window.console.log(`Log: ${content}`);
  }

  static LogError(content) {
    window.console.log(`Error: ${content}`);
    window.alert(content);
  }

  static LogWarning(content) {
    window.console.log(`Warning: ${content}`);
  }
}

module.exports = Debug;
