"""Task object module."""

import uuid


class Task():
    """Let us bee Task objects."""

    def __init__(self, name, text):
        """constructor - what can I say about they."""
        self.id = uuid.uuid4()
        self.name = name
        self.text = text
        self.done = False
