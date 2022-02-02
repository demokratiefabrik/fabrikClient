/** DEMOKRATIFABRIK standalone Method Libraryies */

export default function useLibraryComposable() {

  /* Add Object filter: helper...
  * <var>.filter only works for lists but not for objects...
  * Returns length of a object/list, while handling null as 0. 
    TODO: same as object?.length rigth?
  */
  const filter = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  const removeItem = (arr: any[], value:any): any[] => { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
  }

  const nLength = (object1) => {
    if (object1 === null) {
      return 0;
    }
    return object1.length;
  };

  const loaded = (object1) => {
    return object1 !== null && object1 !== undefined;
  };

  // randomly choose an entry from array...
  const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const pushSorted = (children, toAdd): any[] => {
    if (!toAdd.content.order_position) {
      children.push(toAdd);
      return children;
    }
    function getIndex(children, toAdd) {
      const idx = children.findIndex(
        (x) => x.content.order_position > toAdd.content.order_position
      );
      return idx === -1 ? children.length : idx;
    }

    const ix = getIndex(children, toAdd);
    children.splice(ix, 0, toAdd);
    return children;
  };

  const getOffsetTop = (element: HTMLElement) => {
    // TODO: why not element
    let offsetTop = 0;
    // let el = element
    while (element) {
      offsetTop += element.offsetTop;
      if (element.offsetParent) {
        element = element.offsetParent as HTMLElement;
      }
    }
    return offsetTop;
  };

  const timestamp = (): number => {
    const ts = Date.now()
    return Math.round(ts / 1000);
  }

  // const groupBy = (array: any[], key: string | { (obj: any): string }): Record<string, any[]> => {
  //   const keyFn = key instanceof Function ? key : (obj: any) => obj[key]
  //   return array.reduce(
  //     (objectsByKeyValue, obj) => {
  //       const value = keyFn(obj)
  //       objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
  //       return objectsByKeyValue
  //     },
  //     {} as Record<string, any[]>
  //   )
  // }

  return {
    timestamp,
    // groupBy,
    removeItem,
    getOffsetTop,
    pushSorted,
    sample,
    loaded,
    nLength,
    filter,
  };
}
