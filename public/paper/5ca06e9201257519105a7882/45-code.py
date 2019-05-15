class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def swapPairs(self, head: ListNode) -> ListNode:
        if not head: return None
        if not head.next: return head
        ans = head.next
        head.next = self.swapPairs(head.next.next)
        ans.next = head
        return ans