import axios from 'axios'
import isbot from 'isbot'
import { VercelRequest, VercelResponse } from '@vercel/node'
//이름은 edge지만 그냥 단순 서버리스 함수다!!
// Check .env file!
const { APIKEY, USERNAME, MODE } = process.env

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const userAgent = request.headers['user-agent']
  const id = (request.url as string).split('/').filter(p => p).reverse()[0].split('?')[0]
  console.log(id)

  let data = { 
    title: 'dayoung가 운영하는 노션', 
    content: '안녕하세요! 반갑습니다! dayoung이 운영하는 노션 클론 예제입니다!', 
    poster: 'https://heropy.blog/css/images/logo.png' 
  }

  if (isbot(userAgent) && id) {
    console.log('Bot!!')

    const res = await axios({
      url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'apikey': APIKEY as string,
        'username': USERNAME as string
      }
    })
    data = res.data // 봇이라면 봇에 맞게 데이터 넣기!!
  }
  const { title, content, poster } = data // 봇이 아니면 기본 값에 맞게 넣어줌!!

  response //js에 있는 것....!! 
    .setHeader('content-type', 'text/html') // text/html; charset=utf-8 뒤에 차셋은 없어도 됨!! html에 있기 떄무니1!
    .status(200)
    .send(/* html */ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Heropy's Notion</title>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Notion Clone!" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${content}" />
          <meta property="og:image" content="${poster}" />
          <!-- 공유주소와 url주소가 같게 만들어 줘야함 -->
          <meta property="og:url" content="https://notion-vite-vue3-ts-vercel.vercel.app/workspaces/${id}" /> 
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content="Notion Clone!" />
          <meta property="twitter:title" content="${title}" />
          <meta property="twitter:description" content="${content}" />
          <meta property="twitter:image" content="${poster}" />
          <meta property="twitter:url" content="https://notion-vite-vue3-ts-vercel.vercel.app/workspaces/${id}" />
          <link rel="icon" href="https://heropy.blog/css/images/logo.png">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          ${
            MODE === 'development' 
              ? '<script defer type="module" src="/src/main.ts"></script>'
              : '<script type="module" crossorigin src="/assets/index.js"></script><link rel="stylesheet" href="/assets/index.css">'
          }
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>`)
}
