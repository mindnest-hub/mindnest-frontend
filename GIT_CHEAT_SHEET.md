# Git Cheat Sheet for MindNest Development

## Basic Daily Workflow

### 1. Check Status
```bash
git status
```
Shows what files changed

### 2. Add Changes
```bash
git add .                    # Add all files
git add filename.js          # Add specific file
```

### 3. Commit Changes
```bash
git commit -m "Description of changes"
```

### 4. Push to GitHub
```bash
git push origin main
```

---

## Common Commands

### View History
```bash
git log                      # Full history
git log --oneline            # Compact history
git log --graph              # Visual graph
```

### Undo Changes
```bash
git checkout -- filename.js  # Undo changes to file (before commit)
git reset HEAD~1             # Undo last commit (keep changes)
git reset --hard HEAD~1      # Undo last commit (discard changes)
```

### Branches
```bash
git branch                   # List branches
git branch feature-name      # Create new branch
git checkout feature-name    # Switch to branch
git checkout -b feature-name # Create and switch
git merge feature-name       # Merge branch into current
git branch -d feature-name   # Delete branch
```

### Remote
```bash
git remote -v                # Show remote URLs
git pull origin main         # Get latest changes
git fetch                    # Download changes (don't merge)
```

---

## MindNest Specific Workflows

### Quick Deploy (What you do most)
```bash
git add .
git commit -m "Add new feature"
git push origin main
# Vercel auto-deploys!
```

### Create Feature Branch
```bash
git checkout -b feature/legal-docs
# Make changes
git add .
git commit -m "Add legal document templates"
git push origin feature/legal-docs
# Create Pull Request on GitHub
```

### Fix Mistakes
```bash
# Oops, wrong commit message
git commit --amend -m "Correct message"

# Oops, forgot to add a file
git add forgotten-file.js
git commit --amend --no-edit

# Oops, need to undo everything
git reset --hard HEAD
```

---

## Advanced Techniques

### Stash (Save work temporarily)
```bash
git stash                    # Save current changes
git stash pop                # Restore saved changes
git stash list               # View all stashes
```

### Cherry-Pick (Copy specific commit)
```bash
git cherry-pick abc123       # Apply commit abc123 to current branch
```

### Rebase (Clean history)
```bash
git rebase main              # Reapply commits on top of main
git rebase -i HEAD~3         # Interactive rebase last 3 commits
```

### Tags (Version releases)
```bash
git tag v1.0.0               # Create tag
git push origin v1.0.0       # Push tag to GitHub
```

---

## Troubleshooting

### Merge Conflicts
```bash
# 1. Git will mark conflicts in files
# 2. Open file, look for <<<<<<< and >>>>>>>
# 3. Edit to keep what you want
# 4. Remove conflict markers
# 5. git add filename.js
# 6. git commit
```

### Accidentally Committed to Wrong Branch
```bash
git reset HEAD~1             # Undo commit (keep changes)
git checkout correct-branch  # Switch to correct branch
git add .
git commit -m "Message"
```

### Need to Sync with Remote
```bash
git fetch origin
git reset --hard origin/main # WARNING: Discards local changes
```

---

## Best Practices

1. **Commit Often:** Small, focused commits
2. **Write Good Messages:** "Add user authentication" not "fix stuff"
3. **Pull Before Push:** Always `git pull` before `git push`
4. **Use Branches:** Don't work directly on main
5. **Review Before Commit:** Use `git status` and `git diff`

---

## Your Current Setup

**Repository:** https://github.com/mindnest-hub/mindnest-frontend
**Branch:** main
**Remote:** origin

**Quick Commands:**
- Deploy: Double-click `DEPLOY.bat`
- Check status: `git status`
- View history: `git log --oneline`

---

## Learning Resources

**Videos:**
1. Traversy Media - Git Crash Course (30 mins)
2. Programming with Mosh - Git Tutorial (1 hour)
3. freeCodeCamp - Git for Professionals (45 mins)

**Interactive:**
- https://learngitbranching.js.org/ (Visual Git learning)
- https://git-school.github.io/visualizing-git/ (See what commands do)

**Documentation:**
- https://git-scm.com/doc (Official docs)
- https://github.com/git-guides (GitHub guides)

---

## Quick Reference

| Task | Command |
|------|---------|
| Save changes | `git add . && git commit -m "message"` |
| Deploy | `git push origin main` |
| Undo last commit | `git reset HEAD~1` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| See changes | `git status` |
| See history | `git log --oneline` |

---

**Pro Tip:** Use VS Code's built-in Git features! The Source Control panel (Ctrl+Shift+G) makes Git visual and easy.
