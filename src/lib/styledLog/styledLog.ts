import chalk from 'chalk';

function yellow(message: string): string {
  return chalk.yellow(message)
}

function blue(message: string): string {
  return chalk.blue(message)
}

export default { yellow, blue }