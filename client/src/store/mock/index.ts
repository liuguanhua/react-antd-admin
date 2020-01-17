import { deepCopy, assignAreaData } from '@scripts/utils'

export const asyncLoadAreaFile = (level?: 'provinces' | 'cities' | 'areas') => {
  return new Promise<TSetKeyStringProps>((resolve): any => {
    function loadAfterCallback(asyncFun: Promise<any>) {
      return asyncFun.then(mod => {
        resolve(deepCopy(mod.default))
      })
    }
    switch (level) {
      case 'provinces':
        return loadAfterCallback(
          import('@store/mock/china-area/provinces.json')
        )
      case 'cities':
        return loadAfterCallback(import('@store/mock/china-area/cities.json'))
      case 'areas':
        return loadAfterCallback(import('@store/mock/china-area/areas.json'))
      default:
        Promise.all([
          asyncLoadAreaFile('provinces'),
          asyncLoadAreaFile('cities'),
          asyncLoadAreaFile('areas')
        ]).then(data => {
          let [provincesData, citiesData, areasData] = data
          citiesData = assignAreaData(citiesData, areasData)
          provincesData = assignAreaData(
            provincesData,
            citiesData,
            'provinceCode'
          )
          resolve(provincesData)
        })
        break
    }
  })
}