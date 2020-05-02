let intervalIds = [];
let registeredControllers = [];

export default function registerController(predicate, handler, frequency = 1000) {
  if (!intervalIds.some(x => x.frequency === frequency)) {
    scheduleControllerExecution(frequency);
  }

  const controller = { predicate, handler, frequency };

  registeredControllers.push(controller);

  return () => {
    registeredControllers = registeredControllers.filter(c => c !== controller);

    if (registeredControllers.filter(c => c.frequency === frequency).length < 1) {
      cancelControllerExecution(frequency);
    }
  };
}

function scheduleControllerExecution(frequency) {
  intervalIds.push({
    frequency,
    id: setInterval(() => executeController(frequency), frequency),
  });
}

function executeController(frequency) {
  registeredControllers
    .filter(c => c.frequency === frequency)
    .forEach(c => c.predicate() && c.handler && setTimeout(c.handler));
}

function cancelControllerExecution(frequency) {
  const intervalToCancel = intervalIds.find(x => x.frequency === frequency);

  if (!intervalToCancel) {
    throw new Error(`[Klavo Helper]: Interval Record ${frequency} not found`);
  }

  clearInterval(intervalToCancel);
  intervalIds = intervalIds.filter(x => x !== intervalToCancel);
}
