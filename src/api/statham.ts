const movies = [
  { "id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2 },
  { "id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10 },
  { "id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5 }
]

export default {
  fetchMovies() {
    return new Promise((resolve, reject) => {
      // 3秒待ってから返す
      setTimeout(() => {
        resolve(movies)
      }, 3000);
    })
  },
}