import { dataDir } from "./util/path"
import * as xml2js from "xml2js"
import * as fs from "fs"
import { promisify } from "util"
import * as path from "path"

function parseXml(xml: string): Promise<any>  {
  return new Promise((ok, ng) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        ng(err)
        return
      }
      ok(result)
    })
  })
}

function buildXml(xml: any): string {
  const builder = new xml2js.Builder();
  return builder.buildObject(xml);
}

async function main() {
  const filename = "file.svg"
  const filepath = path.resolve(dataDir, filename)
  const xmlStr = (await (promisify(fs.readFile))(filepath)).toString()
  const xmlObj = await parseXml(xmlStr)
  const transform = findDeepAttribute(xmlObj, (k: string) => k === "transform")
  // TODO: transform logic here
  convertAllAttribute(xmlObj, (k: string) => k === "d", (value: string) => value + "###")
  console.log(buildXml(xmlObj))
}

function isPrimitive(object: any): boolean {
  return object !== Object(object)
}

const NOT_FOUND = Symbol("not found")

function findDeepAttribute(object: any, matcher: (key: any) => boolean) : any {
  for (var k in object) {
    if (object.hasOwnProperty(k)) {
      if (isPrimitive(object[k])) {
        if (matcher(k)) {
          return object[k]
        }
      } else {
        const result = findDeepAttribute(object[k], matcher)
        if ( result !== NOT_FOUND) {
          return result
        }
      }
    }
  } 
  return NOT_FOUND
}

function convertAllAttribute<T>(
    object: any,
    matcher: (key: any) => boolean,
    converter: (value: T) => T,
  ) : any {
  for (var k in object) {
    if (object.hasOwnProperty(k)) {
      if (isPrimitive(object[k])) {
        if (matcher(k)) {
          object[k] = converter(object[k])
        }
      } else {
        convertAllAttribute(object[k], matcher, converter)
      }
    }
  }
}

main().catch(console.error)
