import axios from 'axios'

const maxFileLimit = 5 * 1000 * 1000

const UPLOAD_PATH = 'https://tinypng.com/backend/opt/shrink'

// eslint-disable-next-line node/prefer-global/buffer
export async function uploadFileToTinyPng(buff: Buffer) {
  if (buff.toString().length > maxFileLimit)
    throw new Error(`#uploadFileToTinyPng ossPath: 图片大小大于5mb`)

  const res = await axios({
    url: UPLOAD_PATH,
    method: 'post',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Connection': 'keep-alive',
      'Host': 'tinypng.com',
      'DNT': 1,
      'Referer': 'https://tinypng.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0',
      'rejectUnauthorized': false,
      'X-Forwarded-For': Array(4)
        .fill(1)
        .map(() => Math.ceil(Math.random() * 255))
        .join('.'),
      'Postman-Token': Date.now(),
    },
    data: buff,
  })
  const parseString = res.data
  if (parseString === null || !parseString.output.url)
    throw new Error(`#uploadFileToTinyPng: 上传失败, 无回传tinypng url res.data = ${JSON.stringify(parseString)}`)

  const url = parseString.output.url
  const tinyPngBuf = await axios.get(url, {
    responseType: 'arraybuffer',
  })
  return tinyPngBuf.data
}
