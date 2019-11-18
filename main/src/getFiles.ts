import * as fs from "fs"

export const rootDir = (process.env.PORTABLE_EXECUTABLE_DIR || (__dirname + "/../../test")) + "/"

interface IFile {
    name: string,
    path: string
}

export async function filter(arr: any[], callback: Function) {
    const fail = Symbol()

    return (
        await Promise.all(arr.map(async item => (await callback(item)) ? item : Symbol))
    ).filter(item => item != fail)
}

export function stat(path: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            resolve(stats)
        })
    })
}

export function readDir(dir: string): Promise<IFile[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(rootDir + dir, async (err, items) => {
            console.log(items)
            items = await filter(items, async (item: string) => {
                let stats = await stat(rootDir + dir + "/" + item)
                return stats.isFile()
            })

            let res: IFile[] = items.map(item => {
                return {
                    name: item,
                    path: rootDir + dir + "/" + item
                }
            })

            resolve(res)
        })
    })
}