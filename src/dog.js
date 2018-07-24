// @flow
import fetch from 'isomorphic-fetch'

const dogUrl: string = 'https://dog.ceo/api/breeds/image/random'

async function goFetch() {
  fetch(dogUrl)
    .then((data: Response) => data.json())
    .then((jsonData: any) => jsonData.message)
    .then((url: string) => console.log(url))
    .catch((exc) => console.error(exc))
}
