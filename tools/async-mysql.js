const mysql = require('mysql')
const { host, user, password, database } = require('../config')
const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  multipleStatements: true
})

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

let transactionQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.beginTransaction(err1 => {
          if (err1) {
            return reject('开启事务失败')
          } else {
            connection.query(sql, values, (err2, rows) => {
              if (err2) {
                return connection.rollback(() => {
                  console.log(err2.sqlMessage)
                  console.log('数据插入失败数据回滚')
                })
              } else {
                connection.commit(err3 => {
                  if (err3) {
                    console.log('事务提交失败')
                    return reject('事务提交失败')
                  }
                })
                console.log('事务执行成功')
                resolve(rows)
                connection.release()
              }
            })
          }
        })
      }
    })
  })
}

module.exports = { query, transactionQuery }
