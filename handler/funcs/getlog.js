async (d) => {
    const data = d.util.aoiFunc(d);
    const [v="1.0.0"] = data.inside.splits;

let logs = require("../../database/log");
  let V = v.replace("v", "")

data.result = logs[V]?JSON.stringify(Object.assign({}, logs[V], {v:V})):JSON.stringify({})
  
  return {
        code: d.util.setCode(data)
    }
}