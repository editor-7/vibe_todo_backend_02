const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const router = express.Router();

router.use(function (req, res, next) {
  console.log('[todos]', req.method, req.originalUrl);
  next();
});

// 할일 목록 조회
router.get('/', async function (req, res) {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할일 상세 조회
router.get('/:id', async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할일 수정
router.put('/:id', async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }

    const updates = {};
    if (typeof req.body.content === 'string') {
      const trimmed = req.body.content.trim();
      if (!trimmed) {
        return res.status(400).json({ error: '할일 내용을 입력해주세요.' });
      }
      updates.content = trimmed;
    }
    if (typeof req.body.completed === 'boolean') {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: '수정할 값이 없습니다.' });
    }

    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할일 삭제
router.delete('/:id', async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }

    res.json({ message: '삭제 완료', id: todo._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할일 저장
router.post('/', async function (req, res) {
  try {
    console.log('[POST /api/todos] body:', req.body);
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: '요청 본문이 없습니다.' });
    }
    const { content } = req.body;
    const text = content != null ? String(content).trim() : '';
    if (!text) {
      return res.status(400).json({ error: '할일 내용을 입력해주세요.' });
    }
    const todo = await Todo.create({ content: text });
    console.log('[POST /api/todos] 생성됨:', todo._id);
    res.status(201).json(todo);
  } catch (err) {
    console.error('[POST /api/todos] 에러:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
