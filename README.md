# dtmpl

dtmpl是一个实用简洁快速的模板引擎。写这个模引擎的原因是因为在ejs里没找到类似angularjs中ng-if和ng-class类似功能的东西，只能用js代码拼接，特别臃肿，所以在实现ejs功能的基础上增加了[?]功能。经测试dtmpl的解析速度不低于ejs，而且写法更灵活，推荐使用


### - 开关解析
#### [?]常用于动态设置类或HTML结构，非常方便。
#### ？后面是一个表达式，如果为真则返回:后面设置的内容。
```
[?age>50:old] 
[?opt:<span>kkk</span>]
```


### - 模板解析

```
[#./122.html]
```

### - 变量解析
#### [=name]是对HTML转义解析，[-name]是非转义解析

```
[=name]
[-name]
```

### - 代码解析
```
[for(item of list){]
<span>[=item]</span>
[}]
```

### - 特殊符号替换


```
[<] 会被解析成 [，[>] 会被解析成 ]
```

### 下面是一个完整的例子

#### index.html
```
<!DOCTYPE HTML>
<html>
<head>
</head>
<body>
[#./head.html]
<p class="[?age>10:tt]">111</p>
<p>
[for(item of list){]
<span>[=item]</span>
[}]
</p>

</body>
</html>
```

#### head.html
```
<div>head [=name]</div>
```

#### index.js
```
var dtmpl = require('dtmpl');
var fs = require('fs');

var obj = {
    name:'dwl',
    list:[1,2,3,4],
    age:27
}

var output = dtmpl.render(fs.readFileSync('./index.html').toString(),obj);

fs.writeFileSync('./dist.html', out);

```



