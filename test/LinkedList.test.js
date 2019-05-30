const LinkedList = require('../src/LinkedList');

test('insert', () => {
  const linkedList = new LinkedList();

  const one = linkedList.insert("1", "one");
  const two = linkedList.insert("2", "two");
  const three = linkedList.insert("3", "three");

  let node = linkedList.head();
  expect(node.value()).toBe(three.value());
  expect(node.next).toBe(null);
  expect(node.previous.value()).toBe(two.value());

  node = node.previous;
  expect(node.value()).toBe(two.value());
  expect(node.next).toBe(three);
  expect(node.previous.value()).toBe(one.value());

  node = node.previous;
  expect(node.value()).toBe(one.value());
  expect(node.next).toBe(two);
  expect(node.previous).toBe(null);

  const tail = linkedList.tail();
  expect(node).toBe(tail);
})

test('remove', () => {
  const linkedList = new LinkedList();

  const one = linkedList.insert("1", "one");
  const two = linkedList.insert("2", "two");
  const three = linkedList.insert("3", "three");

  linkedList.remove(one);
  expect(linkedList.tail()).toBe(two);
  expect(linkedList.head()).toBe(three);

  linkedList.remove(null);
  expect(linkedList.tail()).toBe(two);
  expect(linkedList.head()).toBe(three);

  const four = linkedList.insert("4", "four");
  expect(linkedList.head()).toBe(four);
});

test('promoting nodes to head', () => {
  const linkedList = new LinkedList();

  const one = linkedList.insert("1", "one");
  const two = linkedList.insert("2", "two");
  const three = linkedList.insert("3", "three");

  linkedList.promoteToHead(one);

  expect(linkedList.size()).toBe(3);

  expect(linkedList.head().value()).toBe(one.value());
  expect(linkedList.head().next).toBe(null);
  expect(linkedList.head().previous.value()).toBe(three.value());

  expect(linkedList.tail().value()).toBe(two.value());
  expect(linkedList.tail().next.value()).toBe(three.value());
  expect(linkedList.tail().previous).toBe(null);
});
