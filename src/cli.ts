import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'
import { convert } from './convert'

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName('zwkang-convert')
  .command('convert [source] [target]', 'start the server', (yargs) => {
    return yargs
      .positional('source', {
        type: 'string',
        describe: 'name to bind on',
      })
      .positional('target', {
        type: 'string',
        describe: 'port to bind on',
      })
  }, (argv) => {
    convert(argv)
  })
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')
  .help()
  .argv
