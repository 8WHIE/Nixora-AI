import { ProgrammingLanguage } from '../types';

export interface CodeTemplate {
  name: string;
  language: ProgrammingLanguage;
  description: string;
  code: string;
}

export const SUPPORTED_LANGUAGES: Array<{
  id: ProgrammingLanguage;
  name: string;
  icon: string;
  extension: string;
}> = [
  { id: 'python', name: 'Python', icon: '🐍', extension: '.py' },
  { id: 'kotlin', name: 'Kotlin (Android)', icon: '🤖', extension: '.kt' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', extension: '.ts' },
  { id: 'react', name: 'React', icon: '⚛️', extension: '.tsx' },
  { id: 'java', name: 'Java', icon: '☕', extension: '.java' },
  { id: 'cpp', name: 'C++', icon: '🚀', extension: '.cpp' },
  { id: 'html', name: 'HTML & CSS', icon: '🌐', extension: '.html' },
  { id: 'sql', name: 'SQL', icon: '🗄️', extension: '.sql' },
  { id: 'rust', name: 'Rust', icon: '🦀', extension: '.rs' },
  { id: 'go', name: 'Go', icon: '🐹', extension: '.go' },
];

export const STARTER_CODE_TEMPLATES: Record<ProgrammingLanguage, string> = {
  kotlin: `// Modern Android Jetpack Compose UI with Nexora
package com.nexora.ai.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun FuturisticMetricCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF1E1B4B).copy(alpha = 0.6f), Color(0xFF0F172A))
                    )
                )
                .padding(20.dp)
        ) {
            Text(text = title, style = MaterialTheme.typography.labelMedium, color = Color(0xFF94A3B8))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = value, style = MaterialTheme.typography.headlineMedium, color = Color(0xFF38BDF8))
        }
    }
}`,
  python: `# Fast, async API fetcher with error handling and retry logic
import asyncio
import aiohttp
from typing import List, Dict, Any

async def fetch_endpoint(session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
    """Fetch JSON payload with exponential backoff retry."""
    for attempt in range(3):
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                if response.status == 200:
                    return await response.json()
        except Exception as e:
            await asyncio.sleep(2 ** attempt)
    return {"error": "Max retries exceeded"}

async def main():
    endpoints = ["https://api.github.com/zen", "https://httpbin.org/get"]
    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(*(fetch_endpoint(session, u) for u in endpoints))
        print("Fetched payloads:", results)

if __name__ == "__main__":
    asyncio.run(main())`,
  typescript: `// High-performance debounce with generic cancel token
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delayMs);
  };

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}`,
  javascript: `// Real-time Event Bus implementation with wildcard support
class NexoraEventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(callback);
      if (list.size === 0) this.listeners.delete(event);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload));
    }
  }
}`,
  react: `import React, { useState, useEffect } from 'react';

export function NexoraPulseCounter() {
  const [count, setCount] = useState(0);
  const [pulsing, setPulsing] = useState(false);

  const increment = () => {
    setCount(prev => prev + 1);
    setPulsing(true);
  };

  useEffect(() => {
    if (pulsing) {
      const timer = setTimeout(() => setPulsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [pulsing]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/20 text-center shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Activity Metric</h3>
      <p className={\`text-5xl font-extrabold my-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 transition-transform duration-200 \${pulsing ? 'scale-110' : 'scale-100'}\`}>
        {count}
      </p>
      <button
        onClick={increment}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-95 active:scale-95 transition-all shadow-md"
      >
        Sync Impulse +1
      </button>
    </div>
  );
}`,
  java: `package com.nexora.dsa;

import java.util.HashMap;
import java.util.Map;

public class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insert(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            map.remove(tail.prev.key);
            remove(tail.prev);
        }
        Node node = new Node(key, value);
        insert(node);
        map.put(key, node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insert(Node node) {
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>

template <typename T>
class NexoraRingBuffer {
private:
    std::vector<T> buffer;
    size_t head = 0;
    size_t tail = 0;
    size_t maxSize;
    bool full = false;

public:
    explicit NexoraRingBuffer(size_t size) : buffer(size), maxSize(size) {}

    void push(T item) {
        buffer[head] = item;
        if (full) {
            tail = (tail + 1) % maxSize;
        }
        head = (head + 1) % maxSize;
        full = (head == tail);
    }

    bool pop(T& item) {
        if (empty()) return false;
        item = buffer[tail];
        full = false;
        tail = (tail + 1) % maxSize;
        return true;
    }

    bool empty() const {
        return (!full && (head == tail));
    }
};

int main() {
    NexoraRingBuffer<int> rb(3);
    rb.push(10);
    rb.push(20);
    rb.push(30);
    rb.push(40); // Overwrites 10
    int val;
    while (rb.pop(val)) {
        std::cout << val << " "; // 20 30 40
    }
    return 0;
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexora AI Interactive Card</title>
  <style>
    body {
      background: #030712;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      padding: 32px;
      width: 320px;
      box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
      text-align: center;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .badge {
      display: inline-block;
      color: #38bdf8;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h2 { margin: 0 0 8px 0; color: #fff; font-size: 24px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
    .btn {
      margin-top: 20px;
      background: linear-gradient(90deg, #6366f1, #a855f7);
      border: none;
      color: white;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">System Architecture</div>
    <h2>Nexora Node</h2>
    <p>Neural edge processor running low-latency synthesis and reactive compilation.</p>
    <button class="btn" onclick="alert('Nexora Engine Activated!')">Activate Node</button>
  </div>
</body>
</html>`,
  css: `/* Futuristic Glassmorphic Neon Styling for Nexora Components */
:root {
  --nexora-neon-cyan: #06b6d4;
  --nexora-neon-purple: #a855f7;
  --nexora-bg-dark: #030712;
  --nexora-surface: rgba(15, 23, 42, 0.75);
}

.nexora-glass-panel {
  background: var(--nexora-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nexora-glass-panel:hover {
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
  transform: translateY(-2px);
}

.nexora-glow-text {
  background: linear-gradient(135deg, var(--nexora-neon-cyan), var(--nexora-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}`,
  sql: `-- High-performance partitioned schema for telemetry events
CREATE TABLE user_telemetry_events (
    event_id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, created_at)
) PARTITION BY RANGE (created_at);

-- GIN index for rapid JSONB querying
CREATE INDEX idx_user_telemetry_payload ON user_telemetry_events USING gin (payload);
CREATE INDEX idx_user_telemetry_user ON user_telemetry_events (user_id, created_at DESC);

-- Query: Aggregate top 10 error events past 24 hours
SELECT 
    payload->>'errorCode' AS error_code,
    COUNT(*) as total_occurrences,
    MAX(created_at) as last_seen
FROM user_telemetry_events
WHERE created_at >= NOW() - INTERVAL '24 hours'
  AND event_type = 'API_FAILURE'
GROUP BY payload->>'errorCode'
ORDER BY total_occurrences DESC
LIMIT 10;`,
  rust: `// Thread-safe concurrent worker pool with graceful cancellation
use std::sync::{mpsc, Arc, Mutex};
use std::thread;

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;

impl ThreadPool {
    pub fn new(size: usize) -> Self {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }

        ThreadPool {
            workers,
            sender: Some(sender),
        }
    }

    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.as_ref().unwrap().send(job).unwrap();
    }
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Self {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => {
                    println!("Worker {} processing job", id);
                    job();
                }
                Err(_) => break,
            }
        });

        Worker {
            id,
            thread: Some(thread),
        }
    }
}`,
  go: `// High throughput concurrent pipeline pattern in Go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func generator(ctx context.Context, nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for _, n := range nums {
			select {
			case <-ctx.Done():
				return
			case out <- n:
			}
		}
	}()
	return out
}

func squareWorker(ctx context.Context, in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for n := range in {
			select {
			case <-ctx.Done():
				return
			case out <- n * n:
			}
		}
	}()
	return out
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	dataStream := generator(ctx, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
	squaredStream := squareWorker(ctx, dataStream)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		for val := range squaredStream {
			fmt.Printf("Computed: %d\\n", val)
		}
	}()
	wg.Wait()
}`
};

export const QUICK_PROMPTS = [
  { label: 'Kotlin Compose Login Screen', icon: '🤖', prompt: 'Create a complete Android Jetpack Compose Login Screen with email validation, password toggle, animated neon button, and Material 3 design.' },
  { label: 'Fix Python Memory Leak', icon: '🐛', prompt: 'Analyze and fix a Python memory leak caused by circular references in a custom caching layer.' },
  { label: 'Explain Dijkstra Algorithm', icon: '🧠', prompt: 'Explain Dijkstra shortest path algorithm with ASCII graph, step-by-step trace, and Python implementation.' },
  { label: 'React 19 Custom Hook', icon: '⚛️', prompt: 'Write a production-ready React 19 custom hook for infinite scroll with IntersectionObserver, caching, and loading state.' },
  { label: 'Build REST API in Express', icon: '🚀', prompt: 'Generate an Express TypeScript REST API router with Zod validation, JWT middleware, and error handling.' },
  { label: 'Write SQL Window Functions', icon: '🗄️', prompt: 'Show how to use SQL Window functions: ROW_NUMBER(), RANK(), and LEAD() for sales leaderboard analytics.' },
];

export const DSA_PROBLEMS_LIBRARY = [
  {
    title: 'Two Sum (Optimal Hash Map)',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    problem: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution and you may not use the same element twice.'
  },
  {
    title: 'LRU Cache (Doubly Linked List + Map)',
    category: 'Design & Data Structures',
    difficulty: 'Medium',
    problem: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for both get and put operations.'
  },
  {
    title: 'Merge K Sorted Lists (Min-Heap)',
    category: 'Heaps & Linked Lists',
    difficulty: 'Hard',
    problem: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.'
  },
  {
    title: 'Coin Change (Bottom-up Dynamic Programming)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    problem: 'Given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money, return the fewest number of coins that you need to make up that amount.'
  },
  {
    title: 'Number of Islands (BFS / DFS Grid Traversal)',
    category: 'Graphs & Matrix',
    difficulty: 'Medium',
    problem: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.'
  }
];

export const PROGRAMMING_TUTORIALS = [
  {
    id: 'android-compose',
    title: 'Modern Android Jetpack Compose 2026',
    category: 'Mobile Android',
    duration: '10 min',
    summary: 'Master declarative UI, State hoisting, LaunchedEffect, and Material 3 design patterns.',
    content: `### 1. The Declarative Paradigm
In Jetpack Compose, the UI is an immutable description of your application state. When state updates, Compose recomposes the affected composables automatically.

### 2. State Hoisting Pattern
Always pass state down and events up:
\`\`\`kotlin
@Composable
fun CounterButton(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
\`\`\`

### 3. Side Effects with LaunchedEffect
Perform asynchronous or one-off tasks tied to composable lifecycle:
\`\`\`kotlin
@Composable
fun UserProfile(userId: String, viewModel: ProfileViewModel) {
    LaunchedEffect(userId) {
        viewModel.loadUserProfile(userId)
    }
}
\`\`\`
`
  },
  {
    id: 'clean-arch',
    title: 'Full-Stack Clean Architecture & MVVM',
    category: 'Architecture',
    duration: '8 min',
    summary: 'Decouple business domain logic from frameworks, UI, and external data sources.',
    content: `### Layers of Clean Architecture
1. **Domain Layer**: Pure entities and Use Cases (interactors). No framework dependencies.
2. **Data Layer**: Repositories, API data sources, database implementations.
3. **Presentation Layer**: ViewModels, Compose/React UI, and state holders.

### Dependency Rule
Dependencies must only point inward toward business rules.
`
  },
  {
    id: 'async-python',
    title: 'High-Concurrency Python AsyncIO & Tasks',
    category: 'Python',
    duration: '7 min',
    summary: 'Run non-blocking I/O operations, manage task groups, and handle cancellation safely.',
    content: `### Concurrency vs Parallelism
AsyncIO provides single-threaded cooperative multitasking ideal for network and disk I/O.

\`\`\`python
import asyncio

async def fetch_item(item_id: int):
    await asyncio.sleep(0.1)
    return f"Result {item_id}"

async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch_item(1))
        t2 = tg.create_task(fetch_item(2))
    print(t1.result(), t2.result())
\`\`\`
`
  }
];
