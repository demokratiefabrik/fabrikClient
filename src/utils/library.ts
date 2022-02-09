/** DEMOKRATIFABRIK standalone Method Libraryies */

import { scroll } from 'quasar';
const { setVerticalScrollPosition } = scroll;
// import { dom } from 'quasar';
// const { offset } = dom;

// export default function useLibraryComposable() {
// export default library {

/* Add Object filter: helper...
  * <var>.filter only works for lists but not for objects...
  * Returns length of a object/list, while handling null as 0. 
    TODO: same as object?.length rigth?
  */
const filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

const removeItem = (arr: any[], value: any): any[] => {
  return arr.filter(function (ele) {
    return ele != value;
  });
};

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
  let offsetTop = 0;
  let el: HTMLElement | null = element
  while (el) {
    offsetTop += el.offsetTop;
    if (el.offsetParent) {
      el = el.offsetParent as HTMLElement;
    }else{
      el = null
    }

  }  
  return offsetTop;
};

const timestamp = (): number => {
  const ts = Date.now();
  return Math.round(ts / 1000);
};

/* SCROLLING */
// ----------------------
// const getOffsetTop = (element) => {
//   let offsetTop = 0;
//   while (element) {
//     offsetTop += element.offsetTop;
//     element = element.offsetParent;
//   }
//   return offsetTop;
// };

const scrollToAnchor = (anchor, headerOffset, duration = 300, lag = 0) => {
  const dom = document.getElementsByName(anchor);
  const ele = dom?.item(0);
  const scrollFnc = () => {
    // let fixedSelectedItem: HTMLElement | null = anchor;
    const elOffset = getOffsetTop(ele) - headerOffset;
    setVerticalScrollPosition(window, elOffset, duration);
    // setTimeout(() => (fixedSelectedItem = null), duration);
  };
  if (lag) {
    setTimeout(scrollFnc, lag);
  } else {
    scrollFnc();
  }
};

// const scrollToAnchorIfNecessary = (anchor, headerOffset, duration = 300, lag = 0) => {
//   const dom = document.getElementsByName(anchor);
//   const ele = dom?.item(0);
//   if (offset(ele).top < 50) {
//     scrollToAnchor(anchor, headerOffset, duration, lag);
//   }
// };
/* Scroll To #Anchor */
// NOT USED
// const anchor = (anchor: string) => {
//   // scroll to element
//   const el = document.querySelector(`a[name=${anchor}]`);
//   el && el.scrollIntoView();

//   // account for fixed header
//   const headerHeight = 200;
//   const scrolledY = window.scrollY;
//   if (scrolledY) {
//     window.scroll(0, scrolledY - headerHeight);
//   }
// };

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

export default {
  timestamp,
  // scrollToAnchorIfNecessary,
  scrollToAnchor,
  removeItem,
  getOffsetTop,
  pushSorted,
  sample,
  loaded,
  nLength,
  filter,
};
// }
